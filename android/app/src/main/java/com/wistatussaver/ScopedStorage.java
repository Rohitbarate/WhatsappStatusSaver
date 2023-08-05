package com.wistatussaver;

import android.Manifest;
import android.app.Activity;
import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.os.storage.StorageManager;
import android.provider.DocumentsContract;

import androidx.activity.ComponentActivity;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import android.util.Log;
import android.widget.RelativeLayout;
import android.widget.Toast;


public class ScopedStorage extends ReactContextBaseJavaModule {
    private static final int REQUEST_CODE_OPEN_DIRECTORY = 1;
    private static final String E_ACTIVITY_DOES_NOT_EXIST = "E_ACTIVITY_DOES_NOT_EXIST";
    private static final String E_FAILED_TO_OPEN_FOLDER = "E_FAILED_TO_OPEN_FOLDER";

    private static final int REQUEST_PERMISSIONS = 1234;
    private static final String[] PERMISSIONS = {
            Manifest.permission.READ_EXTERNAL_STORAGE,
            Manifest.permission.WRITE_EXTERNAL_STORAGE
    };
    public static final File STATUS_DIRECTORY = new File(Environment.getExternalStorageDirectory() +
            File.separator + "WhatsApp/Media/.Statuses");
    

    public static final String STATUS_DIRECTORY_NEW = "content://com.android.externalstorage.documents/tree/primary%3AAndroid%2Fmedia%2Fcom.whatsapp%2FWhatsApp";

    public static String APP_DIR;

    private Context context;

    private static ReactApplicationContext reactApplicationContext;

    private Promise folderPromise;


    public ScopedStorage(ReactApplicationContext reactContext) {

        super(reactContext);
        reactApplicationContext = reactContext;
        reactContext.addActivityEventListener(activityEventListener);
    }

    @NonNull
    @Override
    public String getName() {
        return "ScopedStorage";
    }

    @ReactMethod
    public void requestAccessToStatusesFolder(String appType, Promise promise) {
        Activity currentActivity = getCurrentActivity();
        if (currentActivity == null) {
            promise.reject(E_ACTIVITY_DOES_NOT_EXIST, "Activity doesn't exist");
            return;
        }

        folderPromise = promise;

         // Check if the app is installed
        // if (!isAppInstalled(currentActivity, appType)) {
        //     promise.resolve(getAppNotInstalledResponse());
        //     return;
        // }

        String specificStatusesDirectory = getAppSpecificStatusesDirectory(appType);
        if (specificStatusesDirectory == null) {
            // Invalid app type
            promise.reject("INVALID_APP_TYPE", "Invalid app type: " + appType);
            return;
        }

        StorageManager storageManager = (StorageManager) currentActivity.getSystemService(currentActivity.STORAGE_SERVICE);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
//                Log.d("URI", "inside if()");
                Intent intent = storageManager.getPrimaryStorageVolume().createOpenDocumentTreeIntent();
                String startDir = getAppSpecificStatusesDirectory(appType);

                Uri uri = intent.getParcelableExtra("android.provider.extra.INITIAL_URI");

                String scheme = uri.toString();
                scheme = scheme.replace("/root/", "/document/");
                scheme += "%3A" + startDir;

                uri = Uri.parse(scheme);

                Log.d("URI", uri.toString());


                intent.putExtra("android.provider.extra.INITIAL_URI", uri);
                currentActivity.startActivityForResult(intent, REQUEST_CODE_OPEN_DIRECTORY);
            }
        }
    }

    // Helper method to check if the app is installed
//     private boolean isAppInstalled(Context context, String appType) {
//         PackageManager packageManager = context.getPackageManager();
//         try {
//         packageManager.getPackageInfo("com.whatsapp", PackageManager.GET_ACTIVITIES);
//         return true;
//         } catch (PackageManager.NameNotFoundException e) {
//         return false;
//     }
// }

// Helper method to get the app package based on the app type
    // private String getAppPackage(String appType) {
    //     if ("whatsapp".equalsIgnoreCase(appType)) {
    //         return "com.whatsapp";
    //     } else if ("whatsappB".equalsIgnoreCase(appType)) {
    //         return "com.whatsapp.w4b";
    //     } else {
    //         return null;
    //     }
    // }

    private static String getAppSpecificStatusesDirectory(String appType) {
        if ("whatsapp".equalsIgnoreCase(appType)) {
            return "Android%2Fmedia%2Fcom.whatsapp%2FWhatsApp%2FMedia%2F.Statuses";
        } else if ("whatsappB".equalsIgnoreCase(appType)) {
            return "Android%2Fmedia%2Fcom.whatsapp.w4b%2FWhatsApp Business%2FMedia%2F.Statuses";
        } else {
            // Invalid app type
            return null;
        }
    }

    // Helper method to get the response object when the app is not installed
    private WritableMap getAppNotInstalledResponse() {
        WritableMap response = Arguments.createMap();
        response.putBoolean("success", false);
        response.putString("msg", "The selected app is not installed on the device.");
        return response;
    }

    private WritableMap getAccessGrantedResponse(String uri) {
        WritableMap response = Arguments.createMap();
        response.putBoolean("success", true);
        response.putString("msg", "Access granted!");
        response.putString("uri", uri);
        return response;
    }

    private final ActivityEventListener activityEventListener = new BaseActivityEventListener() {
        /**
         * @param activity
         * @param requestCode
         * @param resultCode
         * @param data
         */
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
            if (requestCode == REQUEST_CODE_OPEN_DIRECTORY) {
                if (folderPromise != null) {
                    if (resultCode == Activity.RESULT_OK && data != null && data.getData() != null) {
                        Log.d("result", "result");
                        reactApplicationContext.getContentResolver().takePersistableUriPermission(
                                data.getData(),
                                Intent.FLAG_GRANT_READ_URI_PERMISSION |
                                        Intent.FLAG_GRANT_WRITE_URI_PERMISSION);

                        // Toast.makeText(context, "Success", Toast.LENGTH_SHORT).show();
                        Uri directoryUri = data.getData();

                        folderPromise.resolve(getAccessGrantedResponse(directoryUri.toString()));
                    } else {
                        folderPromise.reject(E_FAILED_TO_OPEN_FOLDER, "Failed to open folder");
                    }
                    folderPromise = null;
                }
            }
        }
    };

}
