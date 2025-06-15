import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useFormik } from "formik";
import * as Yup from "yup";
import { supabase } from "@/lib/supabase";
import { Toast } from "react-native-toast-notifications";
import { useAuth } from "@/providers/AuthProvider";
import { useEffect, useState } from "react";
import { Redirect } from "expo-router";

export default function Auth() {
  const { session, user } = useAuth();
  const [isSignIn, setIsSignIn] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log(values);
      if (isSignIn) {
        const data = await signIn(values);
        console.log("data", data);

        if(data)  return <Redirect href={"/(tabs)/(shop)"} />;
      } else {
        const data = await SignUp(values);
        console.log("data", data);
        if(data)  return <Redirect href={"/(tabs)/(shop)"} />;
      }
    },
  });

  const signIn = async (data: { email: string; password: string }) => {
    const { error, data: res } = await supabase.auth.signInWithPassword(data);

    if (error) {
      alert(error.message);
    } else {
      Toast.show("Signed in successfully", {
        type: "success",
        placement: "top",
        duration: 1500,
      });
    }
    return res;
  };

  const SignUp = async (data: { email: string; password: string }) => {
    const { error, data: res } = await supabase.auth.signUp(data);

    console.log("res");
    if (error) {
      alert(error.message);
    } else {
      Toast.show("Signed up successfully", {
        type: "success",
        placement: "top",
        duration: 1500,
      });
    }
    return res;
  };

  if (session) return <Redirect href={"/(tabs)/(shop)"} />;

  return (
    <ImageBackground
      source={{
        uri: "https://images.pexels.com/photos/682933/pexels-photo-682933.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      }}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to the App</Text>
        <Text style={styles.subtitle}>Please sign in to continue</Text>
      </View>

      <TextInput
        id="email"
        placeholder="Email"
        style={styles.input}
        value={formik.values.email}
        onChangeText={formik.handleChange("email")}
        editable={!formik.isSubmitting}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        autoFocus={true}
        nativeID="email"
      />
      {formik.errors.email && formik.touched.email && (
        <Text style={styles.error}>{formik.errors.email}</Text>
      )}

      <TextInput
        id="password"
        placeholder="Password"
        style={styles.input}
        value={formik.values.password}
        onChangeText={formik.handleChange("password")}
        editable={!formik.isSubmitting}
        keyboardType="default"
        autoCapitalize="none"
        autoComplete="password"
        autoCorrect={false}
        secureTextEntry={true}
        nativeID="password"
      />
      {formik.errors.password && formik.touched.password && (
        <Text style={styles.error}>{formik.errors.password}</Text>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setIsSignIn(true)
          formik.handleSubmit()
        }}
        disabled={formik.isSubmitting}
      >
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => formik.handleSubmit()}
      >
        <Text style={styles.buttonText}>Sign up</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    width: "100%",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#ddd",
    marginBottom: 32,
  },
  input: {
    width: "90%",
    padding: 12,
    marginBottom: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 8,
    fontSize: 16,
    color: "#000",
  },
  button: {
    backgroundColor: "#6a1b9a",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    width: "90%",
    alignItems: "center",
  },
  signUpButton: {
    backgroundColor: "transparent",
    borderColor: "#fff",
    borderWidth: 1,
  },
  signUpButtonText: {
    color: "#fff",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 16,
    textAlign: "left",
    width: "90%",
  },
});
