import { r as __exportAll } from "../_runtime.mjs";
import { t as __exportAll$1 } from "./rolldown-runtime-D7D4PA-g.mjs";
import { a as getApp, o as getApps, s as initializeApp } from "../_libs/@firebase/app+[...].mjs";
import "../_libs/firebase.mjs";
import { s as getAuth } from "../_libs/firebase__auth.mjs";
import { N as getFirestore, j as doc, p as getDocFromServer } from "../_libs/@firebase/firestore+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/firebase-CdNcIlsJ.js
var firebase_CdNcIlsJ_exports = /* @__PURE__ */ __exportAll({
	a: () => handleFirestoreError,
	i: () => firebase_exports,
	n: () => auth,
	r: () => db,
	t: () => OperationType
});
var firebase_applet_config_default = {
	projectId: "basic-ruler-cghtt",
	appId: "1:277742148413:web:ec988ac7bb81b0b1934354",
	apiKey: "AIzaSyC9aUsH4MOlJXWlsGPQuRSW2B-kbDP4JDQ",
	authDomain: "basic-ruler-cghtt.firebaseapp.com",
	firestoreDatabaseId: "ai-studio-stashortrashhub-ee22289e-a6b3-424b-b156-662530dc3b08",
	storageBucket: "basic-ruler-cghtt.firebasestorage.app",
	messagingSenderId: "277742148413",
	measurementId: "",
	oAuthClientId: "277742148413-g4grqsqhcnbkflbr521upea0uc3tj2mn.apps.googleusercontent.com",
	recaptchaSiteKey: ""
};
var firebase_exports = /* @__PURE__ */ __exportAll$1({
	OperationType: () => OperationType,
	app: () => app,
	auth: () => auth,
	db: () => db,
	firebaseConfig: () => firebase_applet_config_default,
	firestore: () => firestore,
	handleFirestoreError: () => handleFirestoreError,
	testConnection: () => testConnection
});
var app = getApps().length === 0 ? initializeApp(firebase_applet_config_default) : getApp();
var auth = getAuth(app);
var firestore = getFirestore(app, firebase_applet_config_default.firestoreDatabaseId);
var db = firestore;
var OperationType = /* @__PURE__ */ function(OperationType) {
	OperationType["CREATE"] = "create";
	OperationType["UPDATE"] = "update";
	OperationType["DELETE"] = "delete";
	OperationType["LIST"] = "list";
	OperationType["GET"] = "get";
	OperationType["WRITE"] = "write";
	return OperationType;
}({});
function handleFirestoreError(error, operationType, path) {
	const errInfo = {
		error: error instanceof Error ? error.message : String(error),
		authInfo: {
			userId: auth.currentUser?.uid ?? null,
			email: auth.currentUser?.email ?? null,
			emailVerified: auth.currentUser?.emailVerified ?? null,
			isAnonymous: auth.currentUser?.isAnonymous ?? null,
			tenantId: auth.currentUser?.tenantId ?? null,
			providerInfo: auth.currentUser?.providerData?.map((provider) => ({
				providerId: provider.providerId,
				email: provider.email
			})) || []
		},
		operationType,
		path
	};
	console.error("Firestore Error: ", JSON.stringify(errInfo));
	throw new Error(JSON.stringify(errInfo));
}
async function testConnection() {
	try {
		await getDocFromServer(doc(db, "test", "connection"));
	} catch (error) {
		if (error instanceof Error && error.message.includes("the client is offline")) console.error("Please check your Firebase configuration.");
	}
}
if (typeof window !== "undefined") testConnection().catch(() => {});
//#endregion
export { handleFirestoreError as a, firebase_CdNcIlsJ_exports as i, auth as n, db as r, OperationType as t };
