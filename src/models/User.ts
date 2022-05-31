export interface firebaseUser {
  uid?: string
  email?: string
  displayName?: string
  photoURL?: string
  emailVerified?: boolean
  isAnonymous?: boolean
  createdAt?: string
  lastLoginAt?: string
  apiKey?: string
  appName?: string
}

export const sanitizeUser = (user: any): firebaseUser => {
  const serialized = JSON.parse(JSON.stringify(user))

  return {
    uid: serialized.uid,
    email: serialized.email,
    displayName: serialized.displayName,
    photoURL: serialized.photoURL,
    emailVerified: serialized.emailVerified,
    isAnonymous: serialized.isAnonymous,
    createdAt: serialized.createdAt,
    lastLoginAt: serialized.lastLoginAt,
    apiKey: serialized.apiKey,
    appName: serialized.appName
  }
}
