import { r as __exportAll } from "../_runtime.mjs";
import { c as registerVersion } from "./@firebase/app+[...].mjs";
import "./firebase__auth.mjs";
import { C as DocumentReference, D as Query, E as FirestoreError, M as ensureFirestoreConfigured, O as Timestamp, S as DocumentKey, T as Firestore, _ as setDoc, a as QueryFieldFilterConstraint, b as writeBatch, c as SnapshotMetadata, d as executeWrite, f as getDoc, g as query, h as limit, i as QueryDocumentSnapshot, j as doc, k as cast, l as WriteBatch, m as getDocs, n as QueryCompositeFilterConstraint, o as QueryLimitConstraint, p as getDocFromServer, r as QueryConstraint, s as QuerySnapshot, t as DocumentSnapshot, u as deleteDoc, v as updateDoc, w as FieldPath, x as AutoId, y as where } from "./@firebase/firestore+[...].mjs";
//#region node_modules/firebase/app/dist/index.mjs
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
registerVersion("firebase", "12.19.0", "app");
//#endregion
//#region node_modules/firebase/firestore/dist/index.mjs
var dist_exports = /* @__PURE__ */ __exportAll({
	CACHE_SIZE_UNLIMITED: () => -1,
	DocumentReference: () => DocumentReference,
	DocumentSnapshot: () => DocumentSnapshot,
	FieldPath: () => FieldPath,
	Firestore: () => Firestore,
	FirestoreError: () => FirestoreError,
	Query: () => Query,
	QueryCompositeFilterConstraint: () => QueryCompositeFilterConstraint,
	QueryConstraint: () => QueryConstraint,
	QueryDocumentSnapshot: () => QueryDocumentSnapshot,
	QueryFieldFilterConstraint: () => QueryFieldFilterConstraint,
	QueryLimitConstraint: () => QueryLimitConstraint,
	QuerySnapshot: () => QuerySnapshot,
	SnapshotMetadata: () => SnapshotMetadata,
	Timestamp: () => Timestamp,
	WriteBatch: () => WriteBatch,
	_AutoId: () => AutoId,
	_DocumentKey: () => DocumentKey,
	_cast: () => cast,
	deleteDoc: () => deleteDoc,
	doc: () => doc,
	ensureFirestoreConfigured: () => ensureFirestoreConfigured,
	executeWrite: () => executeWrite,
	getDoc: () => getDoc,
	getDocFromServer: () => getDocFromServer,
	getDocs: () => getDocs,
	limit: () => limit,
	query: () => query,
	setDoc: () => setDoc,
	updateDoc: () => updateDoc,
	where: () => where,
	writeBatch: () => writeBatch
});
//#endregion
export { dist_exports as t };
