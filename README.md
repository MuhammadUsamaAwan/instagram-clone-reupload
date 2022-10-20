Instagram Clone Created with React, Firebase and TailwindCSS<br>
To run on local

- Go to firebase, login with google, go to console
- Add project, name your project, disable google anayltics
- Project overview > project settings > your apps (under genral tab) > web app
- Name your app, put all your keys in a .env.local file
  ```dockerfile
  REACT_APP_FIREBASE_API_KEY=
  REACT_APP_FIREBASE_AUTH_DOMAIN=
  REACT_APP_FIREBASE_PROJECT_ID=
  REACT_APP_FIREBASE_STORAGE_BUCKET=
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
  REACT_APP_FIREBASE_APP_ID=
  ```
- Project Settings > build > athentication > sign in method > enable email/password and facebook
- For facebook Go to [Facebook for Developers](https://developers.facebook.com/). Head to my apps and selected consumer and finish. Once the app is created to go settings > basic settings and copy the **app id** and **app secret** to firebase provider. Copy the OAuth redirect URI. Go to dashboard setup facebook login. Under valid OAuth redirect URI paste.
- Project Settings > build > enable firestore and paste the following rules

  ```
  rules_version = '2';
  service cloud.firestore {
  match /databases/{database}/documents {

  	// USERS
    match /users/{userId} {
    	allow create;
      allow read;
      allow update: if isSignedIn();
      allow delete: if isOwner(userId);
    }

    // POSTS
    match /posts/{postId} {
    	allow create: if isSignedIn();
      allow read;
      allow update: if isSignedIn();
      allow delete: if resource.data.userRef == request.auth.uid;
    }

    match /{document=**} {
      allow read: if isSignedIn();
      allow write: if isSignedIn();
    }

    // FUNCTIONS
    function isOwner(userId) {
      return request.auth.uid == userId;
    }

    function isSignedIn() {
      return request.auth != null;
    }
  }
  }
  ```

- Project Settings > build > enable storage and paste the following rules

```
  service firebase.storage {
  match /b/{bucket}/o {

    // All Paths
    match /{allPaths=**} {
      allow read;
      allow write: if
      isSignedIn() &&
      incomingData().size < 2 * 1024 * 1024 &&
      incomingData().contentType.matches('image/png') || incomingData().contentType.matches('image/jpeg')
    }

    // FUNCTIONS
    function isSignedIn() {
      return request.auth != null;
    }

    function incomingData() {
      return request.resource;
    }
  }
  }
```
