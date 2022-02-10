import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Dimensions,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;
export default function Map() {
  // start Position
  const [startPoint, setStartPoint] = useState({
    latitude: 30.88929,
    longitude: 75.858386,
  });
  const initialPointLat = startPoint.latitude;
  const initialPointLng = startPoint.longitude;
  // Destination
  const [endPoint, setEndPoint] = useState({
    latitude: 30.88929,
    longitude: 75.858386,
  });
  const endPointLat = endPoint.latitude;
  const endPointLng = endPoint.longitude;

  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  console.log(duration);
  const initialRegion = {
    latitude: 30.88929,
    longitude: 75.858386,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const ref = useRef(null);
  useEffect(() => {
    if (startPoint.latitude == 0.0 && endPoint.latitude == 0.0) {
      return;
    } else {
      ref.current.fitToCoordinates([startPoint, endPoint], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      });
    }
  }, [startPoint, endPoint]);

  useEffect(() => {
    if (startPoint.latitude == 0.0 && endPoint.latitude == 0.0) {
      return;
    }
    const getTravelTime = async () => {
      fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${startPoint.latitude},${startPoint.longitude}&destinations=${endPoint.latitude},${endPoint.longitude}&key=${GOOGLE_API_KEY}`
      )
        .then((res) => res.json())
        .then((data) => {
          setDistance(data.rows[0].elements[0].distance.text);
          setDuration(data.rows[0].elements[0].duration.text);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getTravelTime();
  }, [startPoint, endPoint]);
  return (
    <>
      {duration === null && distance === null ? null : (
        <View style={styles.textContainer}>
          <Text>Duration:{duration}</Text>
          <Text>Distance:{distance}</Text>
        </View>
      )}

      <MapView ref={ref} style={styles.map} initialRegion={initialRegion}>
        <Marker
          coordinate={{
            latitude: initialPointLat,
            longitude: initialPointLng,
          }}
        />
        <Marker
          coordinate={{
            latitude: endPointLat,
            longitude: endPointLng,
          }}
          pinColor="yellow"
        />
        <MapViewDirections
          origin={{ latitude: initialPointLat, longitude: initialPointLng }}
          destination={{ latitude: endPointLat, longitude: endPointLng }}
          apikey={GOOGLE_API_KEY}
          strokeWidth={3}
          strokeColor="hotpink"
          onReady={(result) => {}}
          // onError={(error) => {
          //   console.log(error, "Couldn't find directions");
          // }}
        />
      </MapView>
      <View style={styles.autoCompleteContainer}>
        <GooglePlacesAutocomplete
          style={styles.input}
          placeholder="Where from?"
          debounce={500}
          autoFocus={false}
          fetchDetails={true}
          onPress={(data, details = null) => {
            setStartPoint({
              longitude: details.geometry.location.lng,
              latitude: details.geometry.location.lat,
            });
          }}
          query={{
            key: GOOGLE_API_KEY,
            language: "en",
          }}
        />
        <GooglePlacesAutocomplete
          style={styles.input}
          placeholder="Where to?"
          debounce={500}
          autoFocus={false}
          fetchDetails={true}
          onPress={(data, details = null) => {
            setEndPoint({
              longitude: details.geometry.location.lng,
              latitude: details.geometry.location.lat,
            });
          }}
          query={{
            key: GOOGLE_API_KEY,
            language: "en",
          }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    height: 30,
    backgroundColor: "#FFF",
    marginHorizontal: 10,
    bottom: 40,
    borderRadius: 15,
    backgroundColor: "hotpink",
  },
  textInputContainer: {
    backgroundColor: "white",
    paddingTop: 20,
    flex: 0,
    marginBottom: "30%",
  },
  autoCompleteContainer: {
    width: "100%",
    height: "40%",
  },
  textContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    top: 10,
  },
});
