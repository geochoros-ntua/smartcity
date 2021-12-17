import mercantile, requests, json
import mysql.connector
from vt2geojson.tools import vt_bytes_to_geojson
import base64
import mapbox_vector_tile

# vector tile endpoints -- change this in the API request to reference the correct endpoint
tile_points = 'mly_map_feature_point'
tile_traffic_signs = 'mly_map_feature_traffic_sign'
tile_coverage = 'mly1_public'  # for images and sequences
# this an existing organization=. No idea who is but its a good case study as it has populated most of Athens.
organization_id = 1805883732926354

# tile layer depends which vector tile endpoints:
# 1. if map features or traffic signs, it will be "point" always
# 2. if looking for coverage, it will be "image" for points, "sequence" for lines, or "overview" for far zoom
tile_layers = ["sequence", "image", "point", "traffic_sign"]

# Mapillary access token. This is private to p.tsagkis. Use it for dev purposes
access_token = 'MLY|4195156090570097|6a0d147f286068b5fc9a83bb734dc467'

# a bounding box in [east_lng,_south_lat,west_lng,north_lat] format
west, south, east, north = [23.691416, 37.962741, 23.760853, 37.996839]

# get the list of tiles with x and y coordinates which intersect our bounding box
# MUST be at zoom level 14 where the data is available, other zooms currently not supported
tiles = list(mercantile.tiles(west, south, east, north, 14))


def get_connection():
  return mysql.connector.connect(
    user='info212790_walkability',
    password='walkability_pass',
    host='185.138.42.100',
    database='info212790_walkability'
  )


def parse_mpl_images():
  cnx = get_connection()
  cursor = cnx.cursor()
  cursor.execute('DROP TABLE IF EXISTS mapillary_images')
  cursor.execute('CREATE TABLE mapillary_images (' +
                 'OGR_FID int(11) NOT NULL AUTO_INCREMENT,' +
                 'GEOM geometry NOT NULL,' +
                 'captured_at bigint(20) DEFAULT NULL,' +
                 'id text DEFAULT NULL,' +
                 'image_id text DEFAULT NULL,' +
                 'is_pano decimal(1,0) DEFAULT NULL,' +
                 'organization_id bigint(20) DEFAULT NULL,' +
                 'compass_angle double DEFAULT NULL,' +
                 'sequence_id text DEFAULT NULL,' +
                 'PRIMARY KEY (OGR_FID)'
                 ') ENGINE=InnoDB DEFAULT CHARSET=utf8'
                 )
  cursor.execute('ALTER TABLE mapillary_images  ADD SPATIAL KEY GEOM (GEOM)')
  for tile_lyr in tile_layers:
    if tile_lyr == 'image':


      # define an empty geojson as output
      output = {"type": "FeatureCollection", "features": []}
      for tile in tiles:
        tile_url = 'https://tiles.mapillary.com/maps/vtp/{}/2/{}/{}/{}?access_token={}'.format(tile_coverage, tile.z,
                                                                                               tile.x, tile.y,
                                                                                               access_token)
        response = requests.get(tile_url)
        data = vt_bytes_to_geojson(response.content, tile.x, tile.y, tile.z, layer=tile_lyr)
        for feature in data['features']:

          if 'organization_id' in feature['properties'].keys() and feature['properties'][
            'organization_id'] == organization_id:
            geojson = json.dumps(feature['geometry'], indent=4)

            query = 'INSERT INTO mapillary_images (captured_at, id, is_pano, organization_id, compass_angle, sequence_id, GEOM) VALUES (' \
                    + str(feature['properties']['captured_at']) + ', ' + str(feature['properties']['id']) + ', ' \
                    + str(feature['properties']['is_pano']).upper() + ', ' + str(
              feature['properties']['organization_id']) + ', ' \
                    + str(feature['properties']['compass_angle']) + ", '" \
                    + str(feature['properties']['sequence_id']) + "', " \
                    + "ST_GeomFromGeoJSON('" + geojson + "'))"
            cursor.execute(query)
            output['features'].append(feature)

      with open(tile_lyr + '.geojson', 'w') as f:
        json.dump(output, f)
    cnx.commit()
  cnx.close()


def parse_mpl_sequences():
  cnx = get_connection()
  cursor = cnx.cursor()
  cursor.execute('DROP TABLE IF EXISTS mapillary_sequences')
  cursor.execute('CREATE TABLE mapillary_sequences (' +
                 'OGR_FID int(11) NOT NULL AUTO_INCREMENT,' +
                 'GEOM geometry NOT NULL,' +
                 'captured_at bigint(20) DEFAULT NULL,' +
                 'id text DEFAULT NULL,' +
                 'image_id text DEFAULT NULL,' +
                 'is_pano decimal(1,0) DEFAULT NULL,' +
                 'organization_id bigint(20) DEFAULT NULL,' +
                 'sequence_id text DEFAULT NULL,' +
                 'PRIMARY KEY (OGR_FID)'
                 ') ENGINE=InnoDB DEFAULT CHARSET=utf8'
                 )
  cursor.execute('ALTER TABLE mapillary_sequences  ADD SPATIAL KEY GEOM (GEOM)')
  for tile_lyr in tile_layers:
    if tile_lyr == 'sequence':
      # define an empty geojson as output
      output = {"type": "FeatureCollection", "features": []}
      for tile in tiles:
        tile_url = 'https://tiles.mapillary.com/maps/vtp/{}/2/{}/{}/{}?access_token={}'.format(tile_coverage, tile.z,
                                                                                               tile.x, tile.y,
                                                                                               access_token)
        response = requests.get(tile_url)
        data = vt_bytes_to_geojson(response.content, tile.x, tile.y, tile.z, layer=tile_lyr)
        for feature in data['features']:
          # do some filtering in here
          if 'organization_id' in feature['properties'].keys() and feature['properties'][
            'organization_id'] == organization_id:
            geojson = json.dumps(feature['geometry'], indent=4)
            query = 'INSERT INTO mapillary_sequences (captured_at, id, image_id, is_pano, organization_id, GEOM) VALUES (' \
                    + str(feature['properties']['captured_at']) + ", '" + str(feature['properties']['id']) + "', " \
                    + str(feature['properties']['image_id']) + ', ' \
                    + str(feature['properties']['is_pano']).upper() + ', ' + str(
              feature['properties']['organization_id']) + ',' \
                    + "ST_GeomFromGeoJSON('" + geojson + "'))"
            cursor.execute(query)
            output['features'].append(feature)

      with open(tile_lyr + '.geojson', 'w') as f:
        json.dump(output, f)
    cnx.commit()
  cnx.close()


def parse_mpl_features():
  cnx = get_connection()
  cursor = cnx.cursor()
  cursor.execute('DROP TABLE IF EXISTS mapillary_points')
  cursor.execute('CREATE TABLE mapillary_points (' +
                 'OGR_FID int(11) NOT NULL AUTO_INCREMENT,' +
                 'GEOM geometry NOT NULL,' +
                 'value text DEFAULT NULL,' +
                 'feature_id text DEFAULT NULL,' +
                 'first_seen_at text DEFAULT NULL,' +
                 'last_seen_at text DEFAULT NULL,' +
                 'PRIMARY KEY (OGR_FID)'
                 ') ENGINE=InnoDB DEFAULT CHARSET=utf8'
                 )
  cursor.execute('ALTER TABLE mapillary_points  ADD SPATIAL KEY GEOM (GEOM)')

  cursor.execute('DROP TABLE IF EXISTS mapillary_features_detail')
  cursor.execute('CREATE TABLE mapillary_features_detail (' +
                 'OGR_FID int(11) NOT NULL AUTO_INCREMENT,' +
                 'image_id text NOT NULL,' +
                 'feature_id text NOT NULL,' +
                 'geometry JSON NOT NULL,' +
                 'PRIMARY KEY (OGR_FID)'
                 ') ENGINE=InnoDB DEFAULT CHARSET=utf8'
                 )

  for tile_lyr in tile_layers:
    if tile_lyr == 'point':
      # define an empty geojson as output
      output = {"type": "FeatureCollection", "features": []}
      for tile in tiles:
        tile_url = 'https://tiles.mapillary.com/maps/vtp/{}/2/{}/{}/{}?access_token={}'.format(tile_points, tile.z,
                                                                                               tile.x, tile.y,
                                                                                               access_token)
        response = requests.get(tile_url)
        data = vt_bytes_to_geojson(response.content, tile.x, tile.y, tile.z, layer=tile_lyr)
        for feature in data['features']:
          geojson = json.dumps(feature['geometry'], indent=4)
          query = "INSERT INTO mapillary_points (feature_id, first_seen_at, value, last_seen_at, GEOM) VALUES ('" \
                  + str(feature['properties']['id']) + "', " \
                  + str(feature['properties']['first_seen_at']) + ", '" + str(feature['properties']['value']) + "', " \
                  + str(feature['properties']['last_seen_at']) + ', ' \
                  + "ST_GeomFromGeoJSON('" + geojson + "'))"
          cursor.execute(query)
          output['features'].append(feature)

          # get feature geometries on image.
          # This is a long long long stpry
          # if u want to know more about it speak with p.tsagkis.
          # it is very trivial
          feature_url = 'https://graph.mapillary.com/' + str(
            feature['properties']['id']) + '/detections?fields=image,value,geometry&access_token=' + access_token
          feature_response = requests.get(feature_url)

          for feat_image in feature_response.json()['data']:
            encoded = feat_image['geometry']
            value = feat_image['value']
            decoded = mapbox_vector_tile.decode(base64.decodebytes(encoded.encode('utf-8')))
            encodedFeatures = []
            extent = decoded['mpy-or']['extent']
            for enc_feat in decoded['mpy-or']['features']:
              # print('enc_feat' + str(enc_feat))
              if enc_feat['geometry']['coordinates']:
                enc_feat_coords = list(
                  map(lambda x: [(x[0] / extent), (1 - (x[1] / extent))], enc_feat['geometry']['coordinates'][0]))
                enc_feat['geometry']['coordinates'] = enc_feat_coords
                encodedFeatures.append(enc_feat['geometry'])
            feat_query = "INSERT INTO mapillary_features_detail (feature_id, image_id, geometry) VALUES ('" \
                         + str(feature['properties']['id']) + "', " \
                         + str(feat_image['image']['id']) + ", " \
                         + json.dumps(str(encodedFeatures)) + ')'
            cursor.execute(feat_query)
          cnx.commit()
      with open(tile_lyr + '.geojson', 'w') as f:
        json.dump(output, f)
    cnx.commit()
  cnx.close()


def parse_mpl_trafic_signs():
  cnx = get_connection()
  cursor = cnx.cursor()
  cursor.execute('DROP TABLE IF EXISTS mapillary_traffic_points')
  cursor.execute('CREATE TABLE mapillary_traffic_points (' +
                 'OGR_FID int(11) NOT NULL AUTO_INCREMENT,' +
                 'GEOM geometry NOT NULL,' +
                 'value text DEFAULT NULL,' +
                 'feature_id text DEFAULT NULL,' +
                 'first_seen_at text DEFAULT NULL,' +
                 'last_seen_at text DEFAULT NULL,' +
                 'PRIMARY KEY (OGR_FID)'
                 ') ENGINE=InnoDB DEFAULT CHARSET=utf8'
                 )
  cursor.execute('ALTER TABLE mapillary_traffic_points  ADD SPATIAL KEY GEOM (GEOM)')
  for tile_lyr in tile_layers:
    if tile_lyr == 'traffic_sign':
      # define an empty geojson as output
      output = {"type": "FeatureCollection", "features": []}
      for tile in tiles:
        tile_url = 'https://tiles.mapillary.com/maps/vtp/{}/2/{}/{}/{}?access_token={}'.format(tile_traffic_signs,
                                                                                               tile.z,
                                                                                               tile.x, tile.y,
                                                                                               access_token)
        response = requests.get(tile_url)
        data = vt_bytes_to_geojson(response.content, tile.x, tile.y, tile.z, layer=tile_lyr)
        print(data)
        for feature in data['features']:
          geojson = json.dumps(feature['geometry'], indent=4)
          query = "INSERT INTO mapillary_traffic_points (feature_id, first_seen_at, value, last_seen_at, GEOM) VALUES ('" \
                  + str(feature['properties']['id']) + "', " \
                  + str(feature['properties']['first_seen_at']) + ", '" + str(feature['properties']['value']) + "', " \
                  + str(feature['properties']['last_seen_at']) + ', ' \
                  + "ST_GeomFromGeoJSON('" + geojson + "'))"
          cursor.execute(query)
          output['features'].append(feature)

      with open(tile_lyr + '_trafic.geojson', 'w') as f:
        json.dump(output, f)
    cnx.commit()
  cnx.close()



# parse_mpl_features()
# parse_mpl_images()
# parse_mpl_sequences()
# parse_mpl_trafic_signs()
