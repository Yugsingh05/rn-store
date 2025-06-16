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
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

export default function Auth() {
  const { session } = useAuth();
  const [isSignIn, setIsSignIn] = useState(true); // Default to sign in
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (session) {
      router.replace("/(tabs)/(shop)");
    }
  }, [session]);

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
      if (isSignIn) {
        await signIn(values);
      } else {
        await signUp(values);
      }
    },
  });

  const signIn = async (values: { email: string; password: string }) => {
    const { error, data } = await supabase.auth.signInWithPassword(values);

    if (error) {
      console.error("Sign In Error:", error.message);
      Toast.show(error.message, {
        type: "danger",
        placement: "top",
        duration: 3000,
      });
      return;
    }

    Toast.show("Signed in successfully", {
      type: "success",
      placement: "top",
      duration: 1500,
    });

    router.push("/(tabs)/(shop)");
  };

  const signUp = async (values: { email: string; password: string }) => {
    const { error, data } = await supabase.auth.signUp(values);

    if (error) {
      console.error("Sign Up Error:", error.message);
      Toast.show(error.message, {
        type: "danger",
        placement: "top",
        duration: 3000,
      });
      return;
    }

    Toast.show("Signed up successfully!", {
      type: "success",
      placement: "top",
      duration: 1500,
    });

    // Optionally auto-sign in user after sign up
    if (data.user && !data.session) {
      Toast.show("Check email to confirm account.", {
        type: "normal",
        placement: "top",
        duration: 4000,
      });
    } else {
      router.push("/(tabs)/(shop)");
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      console.error("Google Sign-In Error:", error.message);
      Toast.show("Google sign-in failed.", {
        type: "danger",
        placement: "top",
        duration: 3000,
      });
    }
  };

  return (
    <ImageBackground
      source={{
        uri: "https://images.pexels.com/photos/682933/pexels-photo-682933.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      }}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        <Text style={styles.title}>{isSignIn ? "Sign In" : "Sign Up"}</Text>
        <Text style={styles.subtitle}>
          {isSignIn
            ? "Log in to continue shopping"
            : "Create an account to start shopping"}
        </Text>
      </View>

      <TextInput
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
      />
      {formik.touched.email && formik.errors.email && (
        <Text style={styles.error}>{formik.errors.email}</Text>
      )}

      <TextInput
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
      />
      {formik.touched.password && formik.errors.password && (
        <Text style={styles.error}>{formik.errors.password}</Text>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => formik.handleSubmit()}
        disabled={formik.isSubmitting}
      >
        <Text style={styles.buttonText}>
          {formik.isSubmitting
            ? "Processing..."
            : isSignIn
            ? "Sign In"
            : "Sign Up"}
        </Text>
      </TouchableOpacity>

      {/* Toggle Between Sign In / Sign Up */}
      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => setIsSignIn(!isSignIn)}
      >
        <Text style={styles.secondaryButtonText}>
          {isSignIn ? "Need an account? Sign Up" : "Already have an account?"}
        </Text>
      </TouchableOpacity>

      {/* OAuth Button - Optional */}
      <TouchableOpacity
        style={[styles.button, styles.googleButton]}
        onPress={signInWithGoogle}
      >
        <Text style={styles.buttonText}>Sign In with Google</Text>
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
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#ddd",
    marginBottom: 32,
    textAlign: "center",
  },
  input: {
    width: "90%",
    padding: 12,
    marginBottom: 12,
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
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#fff",
  },
  secondaryButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  googleButton: {
    backgroundColor: "#db4437",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 16,
    textAlign: "left",
    width: "90%",
  },
});
