/*
 * Copyright 2017 Hannes Buchwald (hannes.buchwald@gmail.com)
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE Version 3;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.gnu.org/licenses/agpl-3.0.de.html
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// variable & configuration
var config = {
  //Test Json file
  //geojson: "http://api.wunderground.com/api/e59ee9f2c70cb3a6/conditions/q/pws:IEASTERN104.json"

  // Original Json file
  geojson: "http://api.wunderground.com/api/e59ee9f2c70cb3a6/geolookup/q/pws:0uxu4sd3.json"

};


// Fetch the GeoJSON file from the weatherstation
$.getJSON(config.geojson, function (data) {
  var responds;

  try {
      responds = data.response.error.type;
  }
  catch(err) {
  }

  // If Station is offline print it
  if(responds == "Station:OFFLINE") {
    console.log(responds);
    document.getElementById("field_name").innerHTML = responds + " - no weather data could be saved! Please connect the weatherstation to the internet.";
  } else {

    console.log(data);

    try {
      // parse all Data to the new json and send it to the main server
      var newData =  {
                 "type": "Feature",
                 "properties": [
                   {
                     "id": data.current_observation.station_id,
                     "status": "Weatherstation",
                     "created_at": data.current_observation.local_time_rfc822,
                     "longitude": data.current_observation.observation_location.longitude,
                     "latitude": data.current_observation.observation_location.latitude,
                     "marker-color": "blue",
                     "temperature": data.current_observation.temp_c,
                     "dew_point": data.current_observation.dewpoint_c,
                     "humidity": data.current_observation.relative_humidity,
                     "precipitation": data.current_observation.precip_today_string,
                     "wind_speed": data.current_observation.wind_kph,
                     "wind_gust": data.current_observation.wind_gust_kph,
                     "wind_direction": data.current_observation.wind_dir,
                     "pressure": data.current_observation.pressure_mb
                   }
                 ],
                 "geometry": [
                   {
                     "type": "Point",
                     "coordinates": [data.current_observation.observation_location.longitude,data.current_observation.observation_location.latitude]
                   }
                 ]
               };
      console.log(newData);


      // send data to server
      $.ajax({
          url: 'https://server-timetracker.herokuapp.com/a5c8e07368efde43/status/',
          type: 'POST',
          contentType: 'application/json; charset=utf-8',
          data: JSON.stringify(newData),
          dataType: 'json',
          async: false,
          success: function(msg) {
              alert(msg);
              // successfuly saved
              document.getElementById("field_name").innerHTML = "The Weatherstaion Data where successfuly saved";
              document.getElementById("field_name").innerHTML = "Latest updated: " + data.current_observation.local_time_rfc822;
          },
          error: function(xhr, ajaxOptions, thrownError) {
              document.getElementById("field_name").innerHTML = "Error while sending";
              // if (xhr.status == 200) {
              //
              //     alert(ajaxOptions);
              // }
              // else {
              //     alert(xhr.status);
              //     alert(thrownError);
              // }
        }
      });
    }
    catch(err) {
      document.getElementById("field_name").innerHTML = "The Weatherstaion Data where not saved - some error had happedn";
    }
}
});
