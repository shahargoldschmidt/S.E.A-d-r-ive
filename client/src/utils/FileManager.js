/* client/src/utils/FileManager.js */
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export const FileManager = {
    /**
     * Professional Download: Saves Base64 content to phone and opens share menu.
     */
    downloadFile: async (fileName, base64Content) => {
        try {
            const fileUri = `${FileSystem.documentDirectory}${fileName}`;
            
            // Write the file to local storage
            await FileSystem.writeAsStringAsync(fileUri, base64Content, {
                encoding: FileSystem.EncodingType.Base64,
            });

            // Open the native share dialog so the user can save or send it
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri);
            } else {
                Alert.alert("Success", `File saved to: ${fileUri}`);
            }
        } catch (error) {
            console.error("Download Error:", error);
            Alert.alert("Error", "Could not save the file to your device.");
        }
    },

    /**
     * Image Selection: Supports both Gallery and Camera for registration/app.
     */
    pickImage: async (useCamera = false) => {
        try {
            // Request permissions based on choice
            const permissionResult = useCamera 
                ? await ImagePicker.requestCameraPermissionsAsync()
                : await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permissionResult.granted) {
                Alert.alert("Permission Denied", `We need access to your ${useCamera ? 'camera' : 'gallery'} to dive deep!`);
                return null;
            }

            // Launch the correct UI
            const result = useCamera 
                ? await ImagePicker.launchCameraAsync({ base64: true, quality: 0.7 })
                : await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 0.7 });

            if (!result.canceled) {
                return result.assets[0]; // Contains uri and base64
            }
            return null;
        } catch (error) {
            console.error("Picker Error:", error);
            return null;
        }
    },

    /**
     * Document Selection: For non-image files (.txt, .pdf, etc.).
     */
    pickDocument: async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "*/*", // Support all file types
                copyToCacheDirectory: true,
            });

            if (!result.canceled) {
                // Read the file content as Base64 to send to our API
                const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
                    encoding: FileSystem.EncodingType.Base64,
                });
                return { ...result.assets[0], base64 };
            }
            return null;
        } catch (error) {
            console.error("Document Error:", error);
            return null;
        }
    }
};