import React from "react";
import {View, Image, ImageBackground, StyleSheet} from "react-native";
import {Button, Card, Input, Text, ThemeProvider} from "@rneui/themed";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";

const theme = {
  colors:{
    primary: '#3b4cca',
    secondary: '#ffcb05',
    background: '#f8f8f8'
  }
}