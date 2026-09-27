import { o as __toESM } from "../_runtime.mjs";
import "../_libs/firebase.mjs";
import { c as onAuthStateChanged, d as signOut } from "../_libs/firebase__auth.mjs";
import { P as serverTimestamp, _ as setDoc, f as getDoc, j as doc } from "../_libs/@firebase/firestore+[...].mjs";
import { n as auth, r as db } from "./firebase-CdNcIlsJ.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime, u as Slot } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as Root } from "../_libs/radix-ui__react-label.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/label-BlRLLIBM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AuthContext = (0, import_react.createContext)(void 0);
function mapFirebaseUser(user) {
	return {
		id: user.uid,
		uid: user.uid,
		email: user.email,
		displayName: user.displayName,
		photoURL: user.photoURL,
		user_metadata: {
			display_name: user.displayName || user.email?.split("@")[0] || "User",
			avatar_url: user.photoURL || void 0
		}
	};
}
function AuthProvider({ children }) {
	const [firebaseUser, setFirebaseUser] = (0, import_react.useState)(null);
	const [user, setUser] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
			setFirebaseUser(fbUser);
			if (fbUser) {
				const mapped = mapFirebaseUser(fbUser);
				setUser(mapped);
				try {
					const userRef = doc(db, "users", fbUser.uid);
					if (!(await getDoc(userRef)).exists()) await setDoc(userRef, {
						id: fbUser.uid,
						email: fbUser.email,
						displayName: fbUser.displayName || fbUser.email?.split("@")[0] || "User",
						avatarUrl: fbUser.photoURL || null,
						createdAt: serverTimestamp(),
						updatedAt: serverTimestamp()
					});
				} catch {}
			} else setUser(null);
			setLoading(false);
		});
		return () => unsubscribe();
	}, []);
	const value = {
		user,
		firebaseUser,
		session: user ? { user } : null,
		loading,
		signOut: async () => {
			await signOut(auth);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, {
		value,
		children
	});
}
function useAuth() {
	const ctx = (0, import_react.useContext)(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
	return ctx;
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline",
			stash: "verdict-badge verdict-gold rounded-xl",
			trash: "verdict-badge verdict-chrome rounded-xl"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
var labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn(labelVariants(), className),
	...props
}));
Label.displayName = Root.displayName;
//#endregion
export { cn as a, Label as i, Button as n, useAuth as o, Input as r, AuthProvider as t };
