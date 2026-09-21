import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-O8e5E0JR.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { E as Plus, K as Globe, M as MessageCircle, S as Search, St as Bell, W as ImagePlus, _ as Shield, _t as Check, ht as ChevronRight, lt as Circle, n as X } from "../_libs/lucide-react.mjs";
import { l as useAuth } from "./router-Ymvu7mB_.mjs";
import { i as cn, n as Input, r as Label, t as Button } from "./label-1cB10GDW.mjs";
import { t as instance } from "../_libs/i18next.mjs";
import { n as initReactI18next, t as useTranslation } from "../_libs/react-i18next.mjs";
import { t as Browser } from "../_libs/i18next-browser-languagedetector+[...].mjs";
import { t as _e } from "../_libs/cmdk.mjs";
import { a as DialogOverlay$1, c as DialogTrigger$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { a as Label2, c as Root2, d as SubTrigger2, f as Trigger, i as ItemIndicator2, l as Separator2, n as Content2, o as Portal2, r as Item2, s as RadioItem2, t as CheckboxItem2, u as SubContent2 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { i as Trigger$1, n as Portal, r as Root2$1, t as Content2$1 } from "../_libs/radix-ui__react-popover.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Header-BKSLqlsv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var en = {
	nav: {
		feed: "Feed",
		brands: "Brands",
		messages: "Messages",
		admin: "Admin",
		dashboard: "Dashboard",
		awards: "Awards",
		post: "Post",
		signIn: "Sign in",
		signOut: "Sign out",
		profile: "Profile"
	},
	home: {
		subtitle: "The Brand Barometer. Post anything about a brand and let the community deliver its verdict in real time — the CX & PR signal that matters.",
		hook: "Every verdict brings brands closer to the people they serve. Cast yours. 🔥",
		emptyTitle: "Nothing to judge yet",
		emptyBodyUser: "Be the first — hit Post something.",
		emptyBodyGuest: "Be the first — sign in and post something."
	},
	engagement: {
		streak: "{{count}}-day streak",
		today: "{{count}} today",
		total: "{{count}} total",
		next: "{{count}} more verdicts to your next badge",
		topCritic: "You're a top critic — brands are listening. 👑"
	},
	vote: {
		stash: "Stash",
		trash: "Trash",
		noVotes: "No votes yet",
		stashPct: "{{pct}}% stash",
		stashCount: "{{count}} stash",
		trashCount: "{{count}} trash",
		signInPrompt: "Sign in to cast your verdict.",
		by: "by {{name}}",
		deletePost: "Delete post",
		deleted: "Deleted.",
		voteFailed: "Vote failed.",
		deleteFailed: "Delete failed."
	},
	submit: {
		trigger: "Post",
		title: "Post something to judge",
		intro: "Tag a brand, add a photo, and let the community decide: stash it or trash it.",
		fieldTitle: "Title",
		titlePh: "These neon sneakers…",
		verdict: "Your verdict",
		needVerdict: "Pick Stash or Trash first.",
		brand: "Brand (optional)",
		brandPh: "Pick a brand",
		noBrand: "No brand",
		category: "Category (optional)",
		categoryPh: "Packaging, ad, product, service…",
		description: "Description (optional)",
		descriptionPh: "Why should people stash or trash this?",
		photo: "Photo (optional)",
		posting: "Posting…",
		submit: "Post it",
		needTitle: "Give it a title first.",
		posted: "Posted! Let the verdict begin.",
		error: "Something went wrong."
	},
	auth: {
		continueGoogle: "Continue with Google",
		continueFacebook: "Continue with Facebook",
		or: "or",
		signIn: "Sign in",
		signUp: "Sign up",
		email: "Email",
		password: "Password",
		displayName: "Display name",
		createAccount: "Create account",
		welcome: "Welcome back!",
		created: "Account created! You're in.",
		googleFailed: "Google sign-in failed.",
		continueApple: "Continue with Apple",
		continueMicrosoft: "Continue with Microsoft",
		continueLinkedIn: "Continue with LinkedIn",
		continueX: "Continue with X (Twitter)",
		socialFailed: "Sign-in failed. Is that provider enabled in Supabase?"
	},
	brand: {
		title: "Brands",
		subtitle: "Verified brands and the community's live verdict on them.",
		create: "Create brand",
		verified: "Verified",
		trustScore: "Trust score",
		requestVerification: "Request verification",
		verificationPending: "Verification pending",
		message: "Message owner",
		posts: "Posts about this brand",
		noBrands: "No brands yet. Be the first to add one.",
		website: "Website",
		by: "Managed by",
		nearYou: "Brands in {{country}}",
		globalTop: "Top brands worldwide",
		seeAll: "See all",
		searchPlaceholder: "Search brands...",
		searchResults: "Brands",
		searchNoResults: "No brands found.",
		addNew: "Add \"{{name}}\" as a new brand",
		verdictTitle: "Stash or Trash {{brand}}?",
		verdictHint: "One tap records your verdict. Tap again to change it.",
		verdictAddStory: "Got a story or a photo? Post it about this brand."
	},
	dashboard: {
		title: "Brand dashboard",
		subtitle: "Manage the brands you represent and track their live sentiment.",
		noBrands: "You don't manage any brands yet.",
		createFirst: "Create your first brand",
		newBrand: "New brand",
		trustScore: "Trust score",
		posts: "Posts",
		stash: "Stash",
		trash: "Trash",
		verified: "Verified",
		unverified: "Unverified",
		requestVerification: "Request verification",
		view: "View page",
		manage: "Manage",
		followers: "Followers"
	},
	brandTeam: {
		team: "Team",
		manageTeam: "{{brand}} team",
		emailPlaceholder: "Work email address",
		invite: "Invite",
		invited: "Invitation saved — access activates when they sign up.",
		inviteFailed: "Could not send that invitation.",
		inviteHint: "Invite your PR, CX and support colleagues. Pending invites activate automatically the moment that email signs up on SOT.",
		noMembers: "No team members yet.",
		remove: "Remove",
		active: "Active",
		pending: "Pending invite",
		role_admin: "Admin",
		role_analyst: "Analyst",
		role_viewer: "Viewer",
		officialResponse: "Official response from {{brand}}",
		respondAsBrand: "Respond as the brand",
		responsePlaceholder: "Reply publicly on behalf of your brand…",
		postResponse: "Post response",
		responsePosted: "Your official response is live.",
		responseFailed: "Could not post that response.",
		kpis: "Last 30 days",
		volume: "Posts",
		stashPct: "Stash %",
		sentiment: "Sentiment",
		positive: "Positive",
		neutral: "Neutral",
		negative: "Negative",
		unanswered: "Unanswered",
		responseTime: "Median reply",
		minutes: "{{count}} min",
		hours: "{{count}} h",
		noResponseYet: "—"
	},
	profile: {
		title: "Your profile",
		subtitle: "Your public identity and activity on SOT.",
		viewPublic: "View public profile",
		noBio: "No bio yet.",
		following: "Following",
		activity: "Your activity"
	},
	awards: {
		title: "The SOT Awards",
		tagline: "The people's verdict, made official.",
		intro: "Every year, the brands the world trusts most are crowned at the SOT Awards — decided entirely by real verdicts from real people. No paid panels. No boardrooms. Just the crowd.",
		leaderboard: "Live leaderboard",
		leaderboardNote: "The current standings that shape this year's awards.",
		rank: "Rank",
		brand: "Brand",
		score: "Trust score",
		categoryTitle: "Award categories",
		cat1: "Most Trusted Brand",
		cat1d: "Highest overall trust score across the year.",
		cat2: "People's Champion",
		cat2d: "Most Stash verdicts from the community.",
		cat3: "Biggest Turnaround",
		cat3d: "Largest trust-score climb over 12 months.",
		cat4: "Rising Star",
		cat4d: "Best new brand of the year.",
		cta: "Represent your brand",
		ctaNote: "Own a brand? Claim your page and climb the leaderboard."
	},
	messages: {
		title: "Messages",
		empty: "No messages yet.",
		placeholder: "Write a message…",
		send: "Send",
		to: "To"
	},
	admin: {
		title: "Verification queue",
		empty: "No pending verification requests.",
		approve: "Approve",
		reject: "Reject",
		approved: "Approved",
		rejected: "Rejected"
	},
	social: {
		comment: "Comment",
		comments: "Comments",
		like: "Like",
		repost: "Repost",
		share: "Share",
		linkCopied: "Link copied!",
		signInToLike: "Sign in to like posts.",
		signInToRepost: "Sign in to repost.",
		signInToComment: "Sign in to join the conversation.",
		addComment: "Add a comment…",
		commentPosted: "Comment posted!",
		commentDeleted: "Comment deleted.",
		commentError: "Could not post your comment.",
		likeError: "Could not update the like.",
		deleteError: "Could not delete the comment.",
		delete: "Delete",
		noComments: "No comments yet. Be the first!",
		trending: "Trending",
		noTrending: "No trending hashtags yet.",
		postsCount: "{{count}} posts",
		hashtagTitle: "#{{tag}}",
		hashtagCount: "{{count}} posts tagged with this hashtag",
		hashtagEmpty: "No posts with #{{tag}} yet.",
		trySomethingElse: "Try one of these instead:",
		notifications: "Notifications",
		notifAll: "All",
		notifLikes: "Likes",
		notifFollows: "Follows",
		notifComments: "Comments",
		notifEmpty: "No notifications yet.",
		notifFollow: "{{name}} started following you",
		notifLikePost: "{{name}} liked your post",
		notifLikeComment: "{{name}} liked your comment",
		notifComment: "{{name}} commented on your post",
		notifMention: "{{name}} mentioned you",
		notifRepost: "{{name}} reposted your post",
		notifOther: "{{name}} interacted with you",
		follow: "Follow",
		unfollow: "Unfollow",
		editProfile: "Edit profile",
		displayName: "Display name",
		bio: "Bio",
		bioPh: "Tell brands who you are…",
		avatarUrl: "Avatar image URL",
		save: "Save",
		saving: "Saving…",
		profileSaved: "Profile updated.",
		profileSaveFailed: "Could not save your profile.",
		statPosts: "Posts",
		statVerdicts: "Verdicts",
		statStash: "Stash",
		statTrash: "Trash",
		statFollowers: "Followers",
		joined: "Joined {{date}}",
		followers: "{{count}} followers",
		following: "Following",
		signInToFollow: "Sign in to follow people.",
		trustScore: "Trust score",
		profileTitle: "Profile",
		profileNotFound: "This profile could not be found.",
		postNotFound: "This post could not be found.",
		postsBy: "Posts by {{name}}",
		noPosts: "No posts yet.",
		backToFeed: "Back to feed",
		unavailable: "Unavailable",
		loadFailed: "We couldn't load this page. Please try again."
	},
	analytics: {
		title: "CX intelligence",
		days: "{{count}}d",
		export: "CSV",
		stashPct: "Stash %",
		stashPctOverTime: "Stash % over time",
		volumeSentiment: "Sentiment volume",
		topVoices: "Top voices",
		noVoices: "No one has posted about this brand in this window yet.",
		someone: "Someone",
		voiceStats: "{{posts}} posts · {{engagement}} engagement · {{followers}} followers",
		crisisTitle: "Crisis alert.",
		crisisBody: "Negative sentiment is at {{share}}% versus a {{baseline}}% baseline. Respond to open posts now.",
		crisisDismiss: "Mark handled",
		crisisDismissFailed: "Could not update the alert."
	},
	common: {
		cancel: "Cancel",
		save: "Save",
		loading: "Loading…"
	}
};
var translations = {
	es: {
		nav: {
			feed: "Inicio",
			brands: "Marcas",
			messages: "Mensajes",
			admin: "Admin",
			dashboard: "Panel",
			awards: "Premios",
			post: "Publicar",
			signIn: "Entrar",
			signOut: "Salir",
			profile: "Perfil"
		},
		home: {
			subtitle: "El barómetro de marcas. Publica cualquier cosa sobre una marca y deja que la comunidad dé su veredicto en tiempo real: la señal de CX y RP que importa.",
			hook: "Cada veredicto acerca las marcas a las personas. Da el tuyo. 🔥",
			emptyTitle: "Todavía no hay nada que juzgar",
			emptyBodyUser: "Sé el primero: pulsa Publicar.",
			emptyBodyGuest: "Sé el primero: inicia sesión y publica algo."
		},
		engagement: {
			streak: "Racha de {{count}} días",
			today: "{{count}} hoy",
			total: "{{count}} en total",
			next: "{{count}} veredictos más para tu próxima insignia",
			topCritic: "Eres un crítico destacado: las marcas te escuchan. 👑"
		},
		vote: {
			stash: "Guardar",
			trash: "Tirar",
			noVotes: "Aún sin votos",
			stashPct: "{{pct}}% guardar",
			stashCount: "{{count}} guardar",
			trashCount: "{{count}} tirar",
			signInPrompt: "Inicia sesión para dar tu veredicto.",
			by: "por {{name}}",
			deletePost: "Eliminar publicación",
			deleted: "Eliminado.",
			voteFailed: "Error al votar.",
			deleteFailed: "Error al eliminar."
		},
		submit: {
			trigger: "Publicar",
			title: "Publica algo para juzgar",
			intro: "Etiqueta una marca, añade una foto y deja que la comunidad decida: guardar o tirar.",
			fieldTitle: "Título",
			titlePh: "Estas zapatillas de neón…",
			brand: "Marca (opcional)",
			brandPh: "Elige una marca",
			noBrand: "Sin marca",
			category: "Categoría (opcional)",
			categoryPh: "Embalaje, anuncio, producto, servicio…",
			description: "Descripción (opcional)",
			descriptionPh: "¿Por qué deberían guardarlo o tirarlo?",
			photo: "Foto (opcional)",
			posting: "Publicando…",
			submit: "Publicar",
			needTitle: "Primero ponle un título.",
			posted: "¡Publicado! Que empiece el veredicto.",
			error: "Algo salió mal."
		},
		auth: {
			continueGoogle: "Continuar con Google",
			or: "o",
			signIn: "Entrar",
			signUp: "Registrarse",
			email: "Correo",
			password: "Contraseña",
			displayName: "Nombre visible",
			createAccount: "Crear cuenta",
			welcome: "¡Bienvenido de nuevo!",
			created: "¡Cuenta creada! Ya estás dentro.",
			googleFailed: "Error al entrar con Google."
		},
		brand: {
			title: "Marcas",
			subtitle: "Marcas verificadas y el veredicto en vivo de la comunidad.",
			create: "Crear marca",
			verified: "Verificada",
			trustScore: "Índice de confianza",
			requestVerification: "Solicitar verificación",
			verificationPending: "Verificación pendiente",
			message: "Mensaje al propietario",
			posts: "Publicaciones sobre esta marca",
			noBrands: "Aún no hay marcas. Sé el primero en añadir una.",
			website: "Sitio web",
			by: "Gestionada por"
		},
		dashboard: {
			title: "Panel de marca",
			subtitle: "Gestiona las marcas que representas y sigue su sentimiento en vivo.",
			noBrands: "Todavía no gestionas ninguna marca.",
			createFirst: "Crea tu primera marca",
			newBrand: "Nueva marca",
			trustScore: "Índice de confianza",
			posts: "Publicaciones",
			stash: "Guardar",
			trash: "Tirar",
			verified: "Verificada",
			unverified: "Sin verificar",
			requestVerification: "Solicitar verificación",
			view: "Ver página",
			manage: "Gestionar"
		},
		awards: {
			title: "Los Premios SOT",
			tagline: "El veredicto del público, hecho oficial.",
			intro: "Cada año, las marcas en las que más confía el mundo son coronadas en los Premios SOT, decididos por veredictos reales de personas reales. Sin paneles pagados. Sin salas de juntas. Solo la gente.",
			leaderboard: "Clasificación en vivo",
			leaderboardNote: "La clasificación actual que define los premios de este año.",
			rank: "Puesto",
			brand: "Marca",
			score: "Índice de confianza",
			categoryTitle: "Categorías",
			cat1: "Marca más confiable",
			cat1d: "Mayor índice de confianza del año.",
			cat2: "Campeón del público",
			cat2d: "Más veredictos de Guardar de la comunidad.",
			cat3: "Mayor recuperación",
			cat3d: "Mayor subida de confianza en 12 meses.",
			cat4: "Estrella emergente",
			cat4d: "Mejor marca nueva del año.",
			cta: "Representa tu marca",
			ctaNote: "¿Tienes una marca? Reclama tu página y sube en la clasificación."
		},
		messages: {
			title: "Mensajes",
			empty: "Aún no hay mensajes.",
			placeholder: "Escribe un mensaje…",
			send: "Enviar",
			to: "Para"
		},
		admin: {
			title: "Cola de verificación",
			empty: "No hay solicitudes pendientes.",
			approve: "Aprobar",
			reject: "Rechazar",
			approved: "Aprobada",
			rejected: "Rechazada"
		},
		common: {
			cancel: "Cancelar",
			save: "Guardar",
			loading: "Cargando…"
		}
	},
	fr: {
		nav: {
			feed: "Accueil",
			brands: "Marques",
			messages: "Messages",
			admin: "Admin",
			dashboard: "Tableau de bord",
			awards: "Prix",
			post: "Publier",
			signIn: "Connexion",
			signOut: "Déconnexion",
			profile: "Profil"
		},
		home: {
			subtitle: "Le baromètre des marques. Publiez ce que vous voulez sur une marque et laissez la communauté rendre son verdict en direct — le signal CX & RP qui compte.",
			hook: "Chaque verdict rapproche les marques de leurs clients. Donnez le vôtre. 🔥",
			emptyTitle: "Rien à juger pour l'instant",
			emptyBodyUser: "Soyez le premier — appuyez sur Publier.",
			emptyBodyGuest: "Soyez le premier — connectez-vous et publiez."
		},
		engagement: {
			streak: "Série de {{count}} jours",
			today: "{{count}} aujourd'hui",
			total: "{{count}} au total",
			next: "Encore {{count}} verdicts avant votre prochain badge",
			topCritic: "Vous êtes un critique de premier plan — les marques écoutent. 👑"
		},
		vote: {
			stash: "Garder",
			trash: "Jeter",
			noVotes: "Aucun vote",
			stashPct: "{{pct}} % garder",
			stashCount: "{{count}} garder",
			trashCount: "{{count}} jeter",
			signInPrompt: "Connectez-vous pour rendre votre verdict.",
			by: "par {{name}}",
			deletePost: "Supprimer la publication",
			deleted: "Supprimé.",
			voteFailed: "Échec du vote.",
			deleteFailed: "Échec de la suppression."
		},
		submit: {
			trigger: "Publier",
			title: "Publiez quelque chose à juger",
			intro: "Identifiez une marque, ajoutez une photo et laissez la communauté décider : garder ou jeter.",
			fieldTitle: "Titre",
			titlePh: "Ces baskets fluo…",
			brand: "Marque (facultatif)",
			brandPh: "Choisir une marque",
			noBrand: "Aucune marque",
			category: "Catégorie (facultatif)",
			categoryPh: "Emballage, pub, produit, service…",
			description: "Description (facultatif)",
			descriptionPh: "Pourquoi faut-il garder ou jeter ?",
			photo: "Photo (facultatif)",
			posting: "Publication…",
			submit: "Publier",
			needTitle: "Ajoutez d'abord un titre.",
			posted: "Publié ! Que le verdict commence.",
			error: "Une erreur est survenue."
		},
		auth: {
			continueGoogle: "Continuer avec Google",
			or: "ou",
			signIn: "Connexion",
			signUp: "Inscription",
			email: "E-mail",
			password: "Mot de passe",
			displayName: "Nom affiché",
			createAccount: "Créer un compte",
			welcome: "Content de vous revoir !",
			created: "Compte créé ! C'est parti.",
			googleFailed: "Échec de la connexion Google."
		},
		brand: {
			title: "Marques",
			subtitle: "Marques vérifiées et verdict en direct de la communauté.",
			create: "Créer une marque",
			verified: "Vérifiée",
			trustScore: "Score de confiance",
			requestVerification: "Demander la vérification",
			verificationPending: "Vérification en attente",
			message: "Contacter le responsable",
			posts: "Publications sur cette marque",
			noBrands: "Aucune marque pour l'instant. Ajoutez la première.",
			website: "Site web",
			by: "Gérée par"
		},
		dashboard: {
			title: "Tableau de bord marque",
			subtitle: "Gérez les marques que vous représentez et suivez leur sentiment en direct.",
			noBrands: "Vous ne gérez encore aucune marque.",
			createFirst: "Créez votre première marque",
			newBrand: "Nouvelle marque",
			trustScore: "Score de confiance",
			posts: "Publications",
			stash: "Garder",
			trash: "Jeter",
			verified: "Vérifiée",
			unverified: "Non vérifiée",
			requestVerification: "Demander la vérification",
			view: "Voir la page",
			manage: "Gérer"
		},
		awards: {
			title: "Les SOT Awards",
			tagline: "Le verdict du public, rendu officiel.",
			intro: "Chaque année, les marques les plus dignes de confiance sont couronnées aux SOT Awards — décidées uniquement par de vrais verdicts de vraies personnes. Pas de jurys payés. Pas de conseils d'administration. Juste la foule.",
			leaderboard: "Classement en direct",
			leaderboardNote: "Le classement actuel qui façonne les prix de cette année.",
			rank: "Rang",
			brand: "Marque",
			score: "Score de confiance",
			categoryTitle: "Catégories",
			cat1: "Marque la plus fiable",
			cat1d: "Meilleur score de confiance de l'année.",
			cat2: "Champion du public",
			cat2d: "Le plus de verdicts Garder.",
			cat3: "Plus grand redressement",
			cat3d: "Plus forte hausse sur 12 mois.",
			cat4: "Étoile montante",
			cat4d: "Meilleure nouvelle marque de l'année.",
			cta: "Représentez votre marque",
			ctaNote: "Vous avez une marque ? Réclamez votre page et grimpez au classement."
		},
		messages: {
			title: "Messages",
			empty: "Aucun message.",
			placeholder: "Écrire un message…",
			send: "Envoyer",
			to: "À"
		},
		admin: {
			title: "File de vérification",
			empty: "Aucune demande en attente.",
			approve: "Approuver",
			reject: "Refuser",
			approved: "Approuvée",
			rejected: "Refusée"
		},
		common: {
			cancel: "Annuler",
			save: "Enregistrer",
			loading: "Chargement…"
		}
	},
	de: {
		nav: {
			feed: "Feed",
			brands: "Marken",
			messages: "Nachrichten",
			admin: "Admin",
			dashboard: "Dashboard",
			awards: "Awards",
			post: "Posten",
			signIn: "Anmelden",
			signOut: "Abmelden",
			profile: "Profil"
		},
		home: {
			subtitle: "Das Marken-Barometer. Poste alles über eine Marke und lass die Community in Echtzeit ihr Urteil fällen – das CX- und PR-Signal, das zählt.",
			hook: "Jedes Urteil bringt Marken näher an ihre Menschen. Gib deins ab. 🔥",
			emptyTitle: "Noch nichts zu bewerten",
			emptyBodyUser: "Sei die/der Erste – tippe auf Posten.",
			emptyBodyGuest: "Sei die/der Erste – melde dich an und poste etwas."
		},
		engagement: {
			streak: "{{count}}-Tage-Serie",
			today: "{{count}} heute",
			total: "{{count}} gesamt",
			next: "Noch {{count}} Urteile bis zum nächsten Abzeichen",
			topCritic: "Du bist Top-Kritiker – Marken hören zu. 👑"
		},
		vote: {
			stash: "Behalten",
			trash: "Wegwerfen",
			noVotes: "Noch keine Stimmen",
			stashPct: "{{pct}} % behalten",
			stashCount: "{{count}} behalten",
			trashCount: "{{count}} wegwerfen",
			signInPrompt: "Melde dich an, um dein Urteil abzugeben.",
			by: "von {{name}}",
			deletePost: "Beitrag löschen",
			deleted: "Gelöscht.",
			voteFailed: "Abstimmung fehlgeschlagen.",
			deleteFailed: "Löschen fehlgeschlagen."
		},
		submit: {
			trigger: "Posten",
			title: "Poste etwas zum Bewerten",
			intro: "Markiere eine Marke, füge ein Foto hinzu und lass die Community entscheiden: behalten oder wegwerfen.",
			fieldTitle: "Titel",
			titlePh: "Diese Neon-Sneaker…",
			brand: "Marke (optional)",
			brandPh: "Marke wählen",
			noBrand: "Keine Marke",
			category: "Kategorie (optional)",
			categoryPh: "Verpackung, Werbung, Produkt, Service…",
			description: "Beschreibung (optional)",
			descriptionPh: "Warum behalten oder wegwerfen?",
			photo: "Foto (optional)",
			posting: "Wird gepostet…",
			submit: "Posten",
			needTitle: "Gib ihm zuerst einen Titel.",
			posted: "Gepostet! Das Urteil beginnt.",
			error: "Etwas ist schiefgelaufen."
		},
		auth: {
			continueGoogle: "Mit Google fortfahren",
			or: "oder",
			signIn: "Anmelden",
			signUp: "Registrieren",
			email: "E-Mail",
			password: "Passwort",
			displayName: "Anzeigename",
			createAccount: "Konto erstellen",
			welcome: "Willkommen zurück!",
			created: "Konto erstellt! Du bist dabei.",
			googleFailed: "Google-Anmeldung fehlgeschlagen."
		},
		brand: {
			title: "Marken",
			subtitle: "Verifizierte Marken und das Live-Urteil der Community.",
			create: "Marke anlegen",
			verified: "Verifiziert",
			trustScore: "Vertrauenswert",
			requestVerification: "Verifizierung anfragen",
			verificationPending: "Verifizierung ausstehend",
			message: "Inhaber kontaktieren",
			posts: "Beiträge zu dieser Marke",
			noBrands: "Noch keine Marken. Füge die erste hinzu.",
			website: "Website",
			by: "Verwaltet von"
		},
		dashboard: {
			title: "Marken-Dashboard",
			subtitle: "Verwalte deine Marken und verfolge ihre Stimmung in Echtzeit.",
			noBrands: "Du verwaltest noch keine Marken.",
			createFirst: "Erste Marke anlegen",
			newBrand: "Neue Marke",
			trustScore: "Vertrauenswert",
			posts: "Beiträge",
			stash: "Behalten",
			trash: "Wegwerfen",
			verified: "Verifiziert",
			unverified: "Nicht verifiziert",
			requestVerification: "Verifizierung anfragen",
			view: "Seite ansehen",
			manage: "Verwalten"
		},
		awards: {
			title: "Die SOT Awards",
			tagline: "Das Urteil der Menschen, offiziell gemacht.",
			intro: "Jedes Jahr werden die vertrauenswürdigsten Marken der Welt bei den SOT Awards gekürt – entschieden allein durch echte Urteile echter Menschen. Keine bezahlten Jurys. Keine Vorstandsetagen. Nur die Menge.",
			leaderboard: "Live-Rangliste",
			leaderboardNote: "Der aktuelle Stand, der die diesjährigen Awards prägt.",
			rank: "Rang",
			brand: "Marke",
			score: "Vertrauenswert",
			categoryTitle: "Kategorien",
			cat1: "Vertrauenswürdigste Marke",
			cat1d: "Höchster Vertrauenswert des Jahres.",
			cat2: "Publikumsliebling",
			cat2d: "Die meisten Behalten-Urteile.",
			cat3: "Größte Trendwende",
			cat3d: "Stärkster Anstieg in 12 Monaten.",
			cat4: "Aufsteiger",
			cat4d: "Beste neue Marke des Jahres.",
			cta: "Vertritt deine Marke",
			ctaNote: "Eigene Marke? Seite beanspruchen und aufsteigen."
		},
		messages: {
			title: "Nachrichten",
			empty: "Noch keine Nachrichten.",
			placeholder: "Nachricht schreiben…",
			send: "Senden",
			to: "An"
		},
		admin: {
			title: "Verifizierungs-Warteschlange",
			empty: "Keine offenen Anfragen.",
			approve: "Genehmigen",
			reject: "Ablehnen",
			approved: "Genehmigt",
			rejected: "Abgelehnt"
		},
		common: {
			cancel: "Abbrechen",
			save: "Speichern",
			loading: "Lädt…"
		}
	},
	pt: {
		nav: {
			feed: "Início",
			brands: "Marcas",
			messages: "Mensagens",
			admin: "Admin",
			dashboard: "Painel",
			awards: "Prémios",
			post: "Publicar",
			signIn: "Entrar",
			signOut: "Sair",
			profile: "Perfil"
		},
		home: {
			subtitle: "O barómetro das marcas. Publica qualquer coisa sobre uma marca e deixa a comunidade dar o veredicto em tempo real — o sinal de CX e RP que importa.",
			hook: "Cada veredicto aproxima as marcas das pessoas. Dá o teu. 🔥",
			emptyTitle: "Ainda não há nada para julgar",
			emptyBodyUser: "Sê o primeiro — toca em Publicar.",
			emptyBodyGuest: "Sê o primeiro — entra e publica algo."
		},
		engagement: {
			streak: "Sequência de {{count}} dias",
			today: "{{count}} hoje",
			total: "{{count}} no total",
			next: "Mais {{count}} veredictos para o próximo distintivo",
			topCritic: "És um crítico de topo — as marcas estão a ouvir. 👑"
		},
		vote: {
			stash: "Guardar",
			trash: "Deitar fora",
			noVotes: "Ainda sem votos",
			stashPct: "{{pct}}% guardar",
			stashCount: "{{count}} guardar",
			trashCount: "{{count}} deitar fora",
			signInPrompt: "Entra para dares o teu veredicto.",
			by: "por {{name}}",
			deletePost: "Eliminar publicação",
			deleted: "Eliminado.",
			voteFailed: "Falha ao votar.",
			deleteFailed: "Falha ao eliminar."
		},
		submit: {
			trigger: "Publicar",
			title: "Publica algo para julgar",
			intro: "Marca uma marca, junta uma foto e deixa a comunidade decidir: guardar ou deitar fora.",
			fieldTitle: "Título",
			titlePh: "Estes ténis néon…",
			brand: "Marca (opcional)",
			brandPh: "Escolher marca",
			noBrand: "Sem marca",
			category: "Categoria (opcional)",
			categoryPh: "Embalagem, anúncio, produto, serviço…",
			description: "Descrição (opcional)",
			descriptionPh: "Porquê guardar ou deitar fora?",
			photo: "Foto (opcional)",
			posting: "A publicar…",
			submit: "Publicar",
			needTitle: "Dá-lhe primeiro um título.",
			posted: "Publicado! Que comece o veredicto.",
			error: "Algo correu mal."
		},
		auth: {
			continueGoogle: "Continuar com Google",
			or: "ou",
			signIn: "Entrar",
			signUp: "Registar",
			email: "E-mail",
			password: "Palavra-passe",
			displayName: "Nome a mostrar",
			createAccount: "Criar conta",
			welcome: "Bem-vindo de volta!",
			created: "Conta criada! Já estás dentro.",
			googleFailed: "Falha ao entrar com Google."
		},
		brand: {
			title: "Marcas",
			subtitle: "Marcas verificadas e o veredicto ao vivo da comunidade.",
			create: "Criar marca",
			verified: "Verificada",
			trustScore: "Índice de confiança",
			requestVerification: "Pedir verificação",
			verificationPending: "Verificação pendente",
			message: "Mensagem ao responsável",
			posts: "Publicações sobre esta marca",
			noBrands: "Ainda não há marcas. Adiciona a primeira.",
			website: "Site",
			by: "Gerida por"
		},
		dashboard: {
			title: "Painel da marca",
			subtitle: "Gere as marcas que representas e acompanha o sentimento ao vivo.",
			noBrands: "Ainda não geres nenhuma marca.",
			createFirst: "Cria a tua primeira marca",
			newBrand: "Nova marca",
			trustScore: "Índice de confiança",
			posts: "Publicações",
			stash: "Guardar",
			trash: "Deitar fora",
			verified: "Verificada",
			unverified: "Não verificada",
			requestVerification: "Pedir verificação",
			view: "Ver página",
			manage: "Gerir"
		},
		awards: {
			title: "Os Prémios SOT",
			tagline: "O veredicto do povo, tornado oficial.",
			intro: "Todos os anos, as marcas em que o mundo mais confia são coroadas nos Prémios SOT — decididos apenas por veredictos reais de pessoas reais. Sem júris pagos. Sem salas de reuniões. Só as pessoas.",
			leaderboard: "Classificação ao vivo",
			leaderboardNote: "A classificação atual que molda os prémios deste ano.",
			rank: "Posição",
			brand: "Marca",
			score: "Índice de confiança",
			categoryTitle: "Categorias",
			cat1: "Marca mais confiável",
			cat1d: "Maior índice de confiança do ano.",
			cat2: "Campeã do público",
			cat2d: "Mais veredictos de Guardar.",
			cat3: "Maior recuperação",
			cat3d: "Maior subida em 12 meses.",
			cat4: "Estrela em ascensão",
			cat4d: "Melhor marca nova do ano.",
			cta: "Representa a tua marca",
			ctaNote: "Tens uma marca? Reivindica a página e sobe na tabela."
		},
		messages: {
			title: "Mensagens",
			empty: "Ainda sem mensagens.",
			placeholder: "Escreve uma mensagem…",
			send: "Enviar",
			to: "Para"
		},
		admin: {
			title: "Fila de verificação",
			empty: "Sem pedidos pendentes.",
			approve: "Aprovar",
			reject: "Rejeitar",
			approved: "Aprovado",
			rejected: "Rejeitado"
		},
		common: {
			cancel: "Cancelar",
			save: "Guardar",
			loading: "A carregar…"
		}
	},
	it: {
		nav: {
			feed: "Feed",
			brands: "Marchi",
			messages: "Messaggi",
			admin: "Admin",
			dashboard: "Cruscotto",
			awards: "Premi",
			post: "Pubblica",
			signIn: "Accedi",
			signOut: "Esci",
			profile: "Profilo"
		},
		home: {
			subtitle: "Il barometro dei marchi. Pubblica qualsiasi cosa su un marchio e lascia che la community dia il suo verdetto in tempo reale: il segnale CX e PR che conta.",
			hook: "Ogni verdetto avvicina i marchi alle persone. Dai il tuo. 🔥",
			emptyTitle: "Niente da giudicare per ora",
			emptyBodyUser: "Sii il primo: tocca Pubblica.",
			emptyBodyGuest: "Sii il primo: accedi e pubblica qualcosa."
		},
		engagement: {
			streak: "Serie di {{count}} giorni",
			today: "{{count}} oggi",
			total: "{{count}} in totale",
			next: "Ancora {{count}} verdetti per il prossimo distintivo",
			topCritic: "Sei un critico top: i marchi ti ascoltano. 👑"
		},
		vote: {
			stash: "Tieni",
			trash: "Butta",
			noVotes: "Nessun voto",
			stashPct: "{{pct}}% tieni",
			stashCount: "{{count}} tieni",
			trashCount: "{{count}} butta",
			signInPrompt: "Accedi per dare il tuo verdetto.",
			by: "di {{name}}",
			deletePost: "Elimina post",
			deleted: "Eliminato.",
			voteFailed: "Voto non riuscito.",
			deleteFailed: "Eliminazione non riuscita."
		},
		submit: {
			trigger: "Pubblica",
			title: "Pubblica qualcosa da giudicare",
			intro: "Tagga un marchio, aggiungi una foto e lascia decidere la community: tieni o butta.",
			fieldTitle: "Titolo",
			titlePh: "Queste sneaker fluo…",
			brand: "Marchio (facoltativo)",
			brandPh: "Scegli un marchio",
			noBrand: "Nessun marchio",
			category: "Categoria (facoltativo)",
			categoryPh: "Packaging, pubblicità, prodotto, servizio…",
			description: "Descrizione (facoltativo)",
			descriptionPh: "Perché tenerlo o buttarlo?",
			photo: "Foto (facoltativo)",
			posting: "Pubblicazione…",
			submit: "Pubblica",
			needTitle: "Dagli prima un titolo.",
			posted: "Pubblicato! Che il verdetto abbia inizio.",
			error: "Qualcosa è andato storto."
		},
		auth: {
			continueGoogle: "Continua con Google",
			or: "oppure",
			signIn: "Accedi",
			signUp: "Registrati",
			email: "Email",
			password: "Password",
			displayName: "Nome visualizzato",
			createAccount: "Crea account",
			welcome: "Bentornato!",
			created: "Account creato! Ci sei.",
			googleFailed: "Accesso Google non riuscito."
		},
		brand: {
			title: "Marchi",
			subtitle: "Marchi verificati e il verdetto live della community.",
			create: "Crea marchio",
			verified: "Verificato",
			trustScore: "Punteggio di fiducia",
			requestVerification: "Richiedi verifica",
			verificationPending: "Verifica in attesa",
			message: "Contatta il titolare",
			posts: "Post su questo marchio",
			noBrands: "Ancora nessun marchio. Aggiungi il primo.",
			website: "Sito web",
			by: "Gestito da"
		},
		dashboard: {
			title: "Cruscotto marchio",
			subtitle: "Gestisci i marchi che rappresenti e monitora il sentiment live.",
			noBrands: "Non gestisci ancora nessun marchio.",
			createFirst: "Crea il tuo primo marchio",
			newBrand: "Nuovo marchio",
			trustScore: "Punteggio di fiducia",
			posts: "Post",
			stash: "Tieni",
			trash: "Butta",
			verified: "Verificato",
			unverified: "Non verificato",
			requestVerification: "Richiedi verifica",
			view: "Vedi pagina",
			manage: "Gestisci"
		},
		awards: {
			title: "I Premi SOT",
			tagline: "Il verdetto della gente, reso ufficiale.",
			intro: "Ogni anno i marchi più affidabili del mondo vengono premiati ai SOT Awards, decisi solo da verdetti reali di persone reali. Nessuna giuria pagata. Nessun consiglio di amministrazione. Solo la gente.",
			leaderboard: "Classifica live",
			leaderboardNote: "La classifica attuale che definisce i premi di quest'anno.",
			rank: "Posizione",
			brand: "Marchio",
			score: "Punteggio di fiducia",
			categoryTitle: "Categorie",
			cat1: "Marchio più affidabile",
			cat1d: "Punteggio di fiducia più alto dell'anno.",
			cat2: "Campione del pubblico",
			cat2d: "Più verdetti Tieni dalla community.",
			cat3: "Miglior rilancio",
			cat3d: "Maggiore crescita in 12 mesi.",
			cat4: "Astro nascente",
			cat4d: "Miglior nuovo marchio dell'anno.",
			cta: "Rappresenta il tuo marchio",
			ctaNote: "Hai un marchio? Rivendica la pagina e scala la classifica."
		},
		messages: {
			title: "Messaggi",
			empty: "Ancora nessun messaggio.",
			placeholder: "Scrivi un messaggio…",
			send: "Invia",
			to: "A"
		},
		admin: {
			title: "Coda di verifica",
			empty: "Nessuna richiesta in sospeso.",
			approve: "Approva",
			reject: "Rifiuta",
			approved: "Approvata",
			rejected: "Rifiutata"
		},
		common: {
			cancel: "Annulla",
			save: "Salva",
			loading: "Caricamento…"
		}
	},
	nl: {
		nav: {
			feed: "Feed",
			brands: "Merken",
			messages: "Berichten",
			admin: "Admin",
			dashboard: "Dashboard",
			awards: "Awards",
			post: "Plaatsen",
			signIn: "Inloggen",
			signOut: "Uitloggen",
			profile: "Profiel"
		},
		home: {
			subtitle: "De merkbarometer. Plaats iets over een merk en laat de community live haar oordeel geven — het CX- en PR-signaal dat telt.",
			hook: "Elk oordeel brengt merken dichter bij hun mensen. Geef het jouwe. 🔥",
			emptyTitle: "Nog niets te beoordelen",
			emptyBodyUser: "Wees de eerste — tik op Plaatsen.",
			emptyBodyGuest: "Wees de eerste — log in en plaats iets."
		},
		engagement: {
			streak: "Reeks van {{count}} dagen",
			today: "{{count}} vandaag",
			total: "{{count}} totaal",
			next: "Nog {{count}} oordelen tot je volgende badge",
			topCritic: "Je bent een topcriticus — merken luisteren. 👑"
		},
		vote: {
			stash: "Houden",
			trash: "Weggooien",
			noVotes: "Nog geen stemmen",
			stashPct: "{{pct}}% houden",
			stashCount: "{{count}} houden",
			trashCount: "{{count}} weggooien",
			signInPrompt: "Log in om je oordeel te geven.",
			by: "door {{name}}",
			deletePost: "Bericht verwijderen",
			deleted: "Verwijderd.",
			voteFailed: "Stemmen mislukt.",
			deleteFailed: "Verwijderen mislukt."
		},
		submit: {
			trigger: "Plaatsen",
			title: "Plaats iets om te beoordelen",
			intro: "Tag een merk, voeg een foto toe en laat de community beslissen: houden of weggooien.",
			fieldTitle: "Titel",
			titlePh: "Deze neon sneakers…",
			brand: "Merk (optioneel)",
			brandPh: "Kies een merk",
			noBrand: "Geen merk",
			category: "Categorie (optioneel)",
			categoryPh: "Verpakking, advertentie, product, service…",
			description: "Omschrijving (optioneel)",
			descriptionPh: "Waarom houden of weggooien?",
			photo: "Foto (optioneel)",
			posting: "Bezig…",
			submit: "Plaatsen",
			needTitle: "Geef het eerst een titel.",
			posted: "Geplaatst! Het oordeel begint.",
			error: "Er ging iets mis."
		},
		auth: {
			continueGoogle: "Doorgaan met Google",
			or: "of",
			signIn: "Inloggen",
			signUp: "Registreren",
			email: "E-mail",
			password: "Wachtwoord",
			displayName: "Weergavenaam",
			createAccount: "Account maken",
			welcome: "Welkom terug!",
			created: "Account aangemaakt! Je bent binnen.",
			googleFailed: "Google-inloggen mislukt."
		},
		brand: {
			title: "Merken",
			subtitle: "Geverifieerde merken en het live oordeel van de community.",
			create: "Merk maken",
			verified: "Geverifieerd",
			trustScore: "Vertrouwensscore",
			requestVerification: "Verificatie aanvragen",
			verificationPending: "Verificatie in behandeling",
			message: "Bericht eigenaar",
			posts: "Berichten over dit merk",
			noBrands: "Nog geen merken. Voeg het eerste toe.",
			website: "Website",
			by: "Beheerd door"
		},
		dashboard: {
			title: "Merkdashboard",
			subtitle: "Beheer je merken en volg hun live sentiment.",
			noBrands: "Je beheert nog geen merken.",
			createFirst: "Maak je eerste merk",
			newBrand: "Nieuw merk",
			trustScore: "Vertrouwensscore",
			posts: "Berichten",
			stash: "Houden",
			trash: "Weggooien",
			verified: "Geverifieerd",
			unverified: "Niet geverifieerd",
			requestVerification: "Verificatie aanvragen",
			view: "Pagina bekijken",
			manage: "Beheren"
		},
		awards: {
			title: "De SOT Awards",
			tagline: "Het oordeel van het publiek, officieel gemaakt.",
			intro: "Elk jaar worden de meest vertrouwde merken bekroond bij de SOT Awards — bepaald door echte oordelen van echte mensen. Geen betaalde jury's. Geen bestuurskamers. Alleen het publiek.",
			leaderboard: "Live ranglijst",
			leaderboardNote: "De huidige stand die de awards van dit jaar bepaalt.",
			rank: "Rang",
			brand: "Merk",
			score: "Vertrouwensscore",
			categoryTitle: "Categorieën",
			cat1: "Meest vertrouwde merk",
			cat1d: "Hoogste vertrouwensscore van het jaar.",
			cat2: "Publiekskampioen",
			cat2d: "Meeste Houden-oordelen.",
			cat3: "Grootste ommekeer",
			cat3d: "Grootste stijging in 12 maanden.",
			cat4: "Rijzende ster",
			cat4d: "Beste nieuwe merk van het jaar.",
			cta: "Vertegenwoordig je merk",
			ctaNote: "Eigen merk? Claim je pagina en klim in de ranglijst."
		},
		messages: {
			title: "Berichten",
			empty: "Nog geen berichten.",
			placeholder: "Schrijf een bericht…",
			send: "Versturen",
			to: "Aan"
		},
		admin: {
			title: "Verificatiewachtrij",
			empty: "Geen openstaande aanvragen.",
			approve: "Goedkeuren",
			reject: "Afwijzen",
			approved: "Goedgekeurd",
			rejected: "Afgewezen"
		},
		common: {
			cancel: "Annuleren",
			save: "Opslaan",
			loading: "Laden…"
		}
	},
	pl: {
		nav: {
			feed: "Aktualności",
			brands: "Marki",
			messages: "Wiadomości",
			admin: "Admin",
			dashboard: "Panel",
			awards: "Nagrody",
			post: "Opublikuj",
			signIn: "Zaloguj",
			signOut: "Wyloguj",
			profile: "Profil"
		},
		home: {
			subtitle: "Barometr marek. Opublikuj cokolwiek o marce, a społeczność wyda werdykt na żywo — sygnał CX i PR, który się liczy.",
			hook: "Każdy werdykt zbliża marki do ludzi. Wydaj swój. 🔥",
			emptyTitle: "Nie ma jeszcze czego oceniać",
			emptyBodyUser: "Bądź pierwszy — kliknij Opublikuj.",
			emptyBodyGuest: "Bądź pierwszy — zaloguj się i opublikuj."
		},
		engagement: {
			streak: "Passa {{count}} dni",
			today: "{{count}} dzisiaj",
			total: "{{count}} łącznie",
			next: "Jeszcze {{count}} werdyktów do kolejnej odznaki",
			topCritic: "Jesteś czołowym krytykiem — marki słuchają. 👑"
		},
		vote: {
			stash: "Zatrzymaj",
			trash: "Wyrzuć",
			noVotes: "Brak głosów",
			stashPct: "{{pct}}% zatrzymaj",
			stashCount: "{{count}} zatrzymaj",
			trashCount: "{{count}} wyrzuć",
			signInPrompt: "Zaloguj się, aby wydać werdykt.",
			by: "przez {{name}}",
			deletePost: "Usuń wpis",
			deleted: "Usunięto.",
			voteFailed: "Głosowanie nie powiodło się.",
			deleteFailed: "Usuwanie nie powiodło się."
		},
		submit: {
			trigger: "Opublikuj",
			title: "Opublikuj coś do oceny",
			intro: "Oznacz markę, dodaj zdjęcie i pozwól społeczności zdecydować: zatrzymać czy wyrzucić.",
			fieldTitle: "Tytuł",
			titlePh: "Te neonowe buty…",
			brand: "Marka (opcjonalnie)",
			brandPh: "Wybierz markę",
			noBrand: "Bez marki",
			category: "Kategoria (opcjonalnie)",
			categoryPh: "Opakowanie, reklama, produkt, usługa…",
			description: "Opis (opcjonalnie)",
			descriptionPh: "Dlaczego zatrzymać lub wyrzucić?",
			photo: "Zdjęcie (opcjonalnie)",
			posting: "Publikowanie…",
			submit: "Opublikuj",
			needTitle: "Najpierw dodaj tytuł.",
			posted: "Opublikowano! Niech zapadnie werdykt.",
			error: "Coś poszło nie tak."
		},
		auth: {
			continueGoogle: "Kontynuuj z Google",
			or: "lub",
			signIn: "Zaloguj",
			signUp: "Zarejestruj",
			email: "E-mail",
			password: "Hasło",
			displayName: "Nazwa wyświetlana",
			createAccount: "Utwórz konto",
			welcome: "Witaj ponownie!",
			created: "Konto utworzone! Jesteś w środku.",
			googleFailed: "Logowanie Google nie powiodło się."
		},
		brand: {
			title: "Marki",
			subtitle: "Zweryfikowane marki i werdykt społeczności na żywo.",
			create: "Utwórz markę",
			verified: "Zweryfikowana",
			trustScore: "Wskaźnik zaufania",
			requestVerification: "Poproś o weryfikację",
			verificationPending: "Weryfikacja w toku",
			message: "Napisz do właściciela",
			posts: "Wpisy o tej marce",
			noBrands: "Brak marek. Dodaj pierwszą.",
			website: "Strona",
			by: "Zarządzane przez"
		},
		dashboard: {
			title: "Panel marki",
			subtitle: "Zarządzaj markami i śledź nastroje na żywo.",
			noBrands: "Nie zarządzasz jeszcze żadną marką.",
			createFirst: "Utwórz pierwszą markę",
			newBrand: "Nowa marka",
			trustScore: "Wskaźnik zaufania",
			posts: "Wpisy",
			stash: "Zatrzymaj",
			trash: "Wyrzuć",
			verified: "Zweryfikowana",
			unverified: "Niezweryfikowana",
			requestVerification: "Poproś o weryfikację",
			view: "Zobacz stronę",
			manage: "Zarządzaj"
		},
		awards: {
			title: "Nagrody SOT",
			tagline: "Werdykt ludzi, oficjalnie.",
			intro: "Co roku najbardziej zaufane marki świata są nagradzane w SOT Awards — decydują wyłącznie prawdziwe werdykty prawdziwych ludzi.",
			leaderboard: "Ranking na żywo",
			leaderboardNote: "Aktualne wyniki kształtujące tegoroczne nagrody.",
			rank: "Miejsce",
			brand: "Marka",
			score: "Wskaźnik zaufania",
			categoryTitle: "Kategorie",
			cat1: "Najbardziej zaufana marka",
			cat1d: "Najwyższy wskaźnik zaufania w roku.",
			cat2: "Wybór ludzi",
			cat2d: "Najwięcej werdyktów Zatrzymaj.",
			cat3: "Największy zwrot",
			cat3d: "Największy wzrost w 12 miesięcy.",
			cat4: "Wschodząca gwiazda",
			cat4d: "Najlepsza nowa marka roku.",
			cta: "Reprezentuj swoją markę",
			ctaNote: "Masz markę? Przejmij stronę i wspinaj się w rankingu."
		},
		messages: {
			title: "Wiadomości",
			empty: "Brak wiadomości.",
			placeholder: "Napisz wiadomość…",
			send: "Wyślij",
			to: "Do"
		},
		admin: {
			title: "Kolejka weryfikacji",
			empty: "Brak oczekujących zgłoszeń.",
			approve: "Zatwierdź",
			reject: "Odrzuć",
			approved: "Zatwierdzono",
			rejected: "Odrzucono"
		},
		common: {
			cancel: "Anuluj",
			save: "Zapisz",
			loading: "Ładowanie…"
		}
	},
	ru: {
		nav: {
			feed: "Лента",
			brands: "Бренды",
			messages: "Сообщения",
			admin: "Админ",
			dashboard: "Панель",
			awards: "Награды",
			post: "Опубликовать",
			signIn: "Войти",
			signOut: "Выйти",
			profile: "Профиль"
		},
		home: {
			subtitle: "Барометр брендов. Опубликуйте что угодно о бренде — сообщество вынесет вердикт в реальном времени. Сигнал CX и PR, который важен.",
			hook: "Каждый вердикт приближает бренды к людям. Вынесите свой. 🔥",
			emptyTitle: "Пока нечего оценивать",
			emptyBodyUser: "Будьте первым — нажмите «Опубликовать».",
			emptyBodyGuest: "Будьте первым — войдите и опубликуйте."
		},
		engagement: {
			streak: "Серия {{count}} дн.",
			today: "{{count}} сегодня",
			total: "{{count}} всего",
			next: "Ещё {{count}} вердиктов до нового значка",
			topCritic: "Вы топ-критик — бренды слушают. 👑"
		},
		vote: {
			stash: "Оставить",
			trash: "Выбросить",
			noVotes: "Голосов пока нет",
			stashPct: "{{pct}}% оставить",
			stashCount: "{{count}} оставить",
			trashCount: "{{count}} выбросить",
			signInPrompt: "Войдите, чтобы вынести вердикт.",
			by: "от {{name}}",
			deletePost: "Удалить публикацию",
			deleted: "Удалено.",
			voteFailed: "Не удалось проголосовать.",
			deleteFailed: "Не удалось удалить."
		},
		submit: {
			trigger: "Опубликовать",
			title: "Опубликуйте что-то на ",
			intro: "Отметьте бренд, добавьте фото и пусть сообщество решит: оставить или выбросить.",
			fieldTitle: "Заголовок",
			titlePh: "Эти неоновые кроссовки…",
			brand: "Бренд (необязательно)",
			brandPh: "Выберите бренд",
			noBrand: "Без бренда",
			category: "Категория (необязательно)",
			categoryPh: "Упаковка, реклама, продукт, сервис…",
			description: "Описание (необязательно)",
			descriptionPh: "Почему оставить или выбросить?",
			photo: "Фото (необязательно)",
			posting: "Публикуем…",
			submit: "Опубликовать",
			needTitle: "Сначала добавьте заголовок.",
			posted: "Опубликовано! Пусть начнётся вердикт.",
			error: "Что-то пошло не так."
		},
		auth: {
			continueGoogle: "Продолжить с Google",
			or: "или",
			signIn: "Войти",
			signUp: "Регистрация",
			email: "Эл. почта",
			password: "Пароль",
			displayName: "Отображаемое имя",
			createAccount: "Создать аккаунт",
			welcome: "С возвращением!",
			created: "Аккаунт создан! Вы в игре.",
			googleFailed: "Не удалось войти через Google."
		},
		brand: {
			title: "Бренды",
			subtitle: "Проверенные бренды и живой вердикт сообщества.",
			create: "Создать бренд",
			verified: "Проверен",
			trustScore: "Индекс доверия",
			requestVerification: "Запросить проверку",
			verificationPending: "Проверка ожидается",
			message: "Написать владельцу",
			posts: "Публикации об этом бренде",
			noBrands: "Брендов пока нет. Добавьте первый.",
			website: "Сайт",
			by: "Управляет"
		},
		dashboard: {
			title: "Панель бренда",
			subtitle: "Управляйте брендами и следите за настроением в реальном времени.",
			noBrands: "Вы пока не управляете брендами.",
			createFirst: "Создайте первый бренд",
			newBrand: "Новый бренд",
			trustScore: "Индекс доверия",
			posts: "Публикации",
			stash: "Оставить",
			trash: "Выбросить",
			verified: "Проверен",
			unverified: "Не проверен",
			requestVerification: "Запросить проверку",
			view: "Открыть страницу",
			manage: "Управлять"
		},
		awards: {
			title: "Премия SOT",
			tagline: "Вердикт людей — официально.",
			intro: "Каждый год самые надёжные бренды мира получают премию SOT — её определяют только реальные вердикты реальных людей.",
			leaderboard: "Рейтинг в реальном времени",
			leaderboardNote: "Текущее положение, определяющее награды этого года.",
			rank: "Место",
			brand: "Бренд",
			score: "Индекс доверия",
			categoryTitle: "Категории",
			cat1: "Самый надёжный бренд",
			cat1d: "Наивысший индекс доверия за год.",
			cat2: "Выбор народа",
			cat2d: "Больше всего вердиктов «Оставить».",
			cat3: "Лучший разворот",
			cat3d: "Наибольший рост за 12 месяцев.",
			cat4: "Восходящая звезда",
			cat4d: "Лучший новый бренд года.",
			cta: "Представляйте свой бренд",
			ctaNote: "Есть бренд? Заявите права на страницу и поднимайтесь в рейтинге."
		},
		messages: {
			title: "Сообщения",
			empty: "Сообщений пока нет.",
			placeholder: "Напишите сообщение…",
			send: "Отправить",
			to: "Кому"
		},
		admin: {
			title: "Очередь проверки",
			empty: "Нет ожидающих заявок.",
			approve: "Одобрить",
			reject: "Отклонить",
			approved: "Одобрено",
			rejected: "Отклонено"
		},
		common: {
			cancel: "Отмена",
			save: "Сохранить",
			loading: "Загрузка…"
		}
	},
	tr: {
		nav: {
			feed: "Akış",
			brands: "Markalar",
			messages: "Mesajlar",
			admin: "Yönetici",
			dashboard: "Panel",
			awards: "Ödüller",
			post: "Paylaş",
			signIn: "Giriş",
			signOut: "Çıkış",
			profile: "Profil"
		},
		home: {
			subtitle: "Marka barometresi. Bir marka hakkında istediğini paylaş, topluluk kararını anında versin — önemli olan CX ve PR sinyali.",
			hook: "Her karar markaları insanlara yaklaştırır. Sen de karar ver. 🔥",
			emptyTitle: "Henüz değerlendirilecek bir şey yok",
			emptyBodyUser: "İlk sen ol — Paylaş'a bas.",
			emptyBodyGuest: "İlk sen ol — giriş yap ve paylaş."
		},
		engagement: {
			streak: "{{count}} günlük seri",
			today: "bugün {{count}}",
			total: "toplam {{count}}",
			next: "Sonraki rozet için {{count}} karar daha",
			topCritic: "Zirvedeki eleştirmensin — markalar dinliyor. 👑"
		},
		vote: {
			stash: "Sakla",
			trash: "At",
			noVotes: "Henüz oy yok",
			stashPct: "%{{pct}} sakla",
			stashCount: "{{count}} sakla",
			trashCount: "{{count}} at",
			signInPrompt: "Karar vermek için giriş yap.",
			by: "{{name}} tarafından",
			deletePost: "Gönderiyi sil",
			deleted: "Silindi.",
			voteFailed: "Oylama başarısız.",
			deleteFailed: "Silme başarısız."
		},
		submit: {
			trigger: "Paylaş",
			title: "Değerlendirilecek bir şey paylaş",
			intro: "Bir markayı etiketle, fotoğraf ekle ve topluluk karar versin: sakla mı, at mı.",
			fieldTitle: "Başlık",
			titlePh: "Bu neon spor ayakkabılar…",
			brand: "Marka (isteğe bağlı)",
			brandPh: "Marka seç",
			noBrand: "Marka yok",
			category: "Kategori (isteğe bağlı)",
			categoryPh: "Ambalaj, reklam, ürün, hizmet…",
			description: "Açıklama (isteğe bağlı)",
			descriptionPh: "Neden saklanmalı ya da atılmalı?",
			photo: "Fotoğraf (isteğe bağlı)",
			posting: "Paylaşılıyor…",
			submit: "Paylaş",
			needTitle: "Önce bir başlık ver.",
			posted: "Paylaşıldı! Karar zamanı.",
			error: "Bir şeyler ters gitti."
		},
		auth: {
			continueGoogle: "Google ile devam et",
			or: "veya",
			signIn: "Giriş",
			signUp: "Kayıt ol",
			email: "E-posta",
			password: "Şifre",
			displayName: "Görünen ad",
			createAccount: "Hesap oluştur",
			welcome: "Tekrar hoş geldin!",
			created: "Hesap oluşturuldu!",
			googleFailed: "Google girişi başarısız."
		},
		brand: {
			title: "Markalar",
			subtitle: "Doğrulanmış markalar ve topluluğun canlı kararı.",
			create: "Marka oluştur",
			verified: "Doğrulandı",
			trustScore: "Güven puanı",
			requestVerification: "Doğrulama iste",
			verificationPending: "Doğrulama bekliyor",
			message: "Sahibine mesaj",
			posts: "Bu marka hakkında gönderiler",
			noBrands: "Henüz marka yok. İlkini ekle.",
			website: "Web sitesi",
			by: "Yöneten"
		},
		dashboard: {
			title: "Marka paneli",
			subtitle: "Temsil ettiğin markaları yönet ve canlı algıyı izle.",
			noBrands: "Henüz bir marka yönetmiyorsun.",
			createFirst: "İlk markanı oluştur",
			newBrand: "Yeni marka",
			trustScore: "Güven puanı",
			posts: "Gönderiler",
			stash: "Sakla",
			trash: "At",
			verified: "Doğrulandı",
			unverified: "Doğrulanmadı",
			requestVerification: "Doğrulama iste",
			view: "Sayfayı gör",
			manage: "Yönet"
		},
		awards: {
			title: "SOT Ödülleri",
			tagline: "Halkın kararı, resmileşti.",
			intro: "Her yıl dünyanın en güvendiği markalar SOT Ödülleri'nde taçlanır — tamamen gerçek insanların gerçek kararlarıyla.",
			leaderboard: "Canlı sıralama",
			leaderboardNote: "Bu yılın ödüllerini şekillendiren güncel sıralama.",
			rank: "Sıra",
			brand: "Marka",
			score: "Güven puanı",
			categoryTitle: "Kategoriler",
			cat1: "En güvenilir marka",
			cat1d: "Yılın en yüksek güven puanı.",
			cat2: "Halkın şampiyonu",
			cat2d: "En çok Sakla kararı.",
			cat3: "En büyük dönüş",
			cat3d: "12 ayda en büyük yükseliş.",
			cat4: "Yükselen yıldız",
			cat4d: "Yılın en iyi yeni markası.",
			cta: "Markanı temsil et",
			ctaNote: "Markan mı var? Sayfanı sahiplen ve sıralamada yüksel."
		},
		messages: {
			title: "Mesajlar",
			empty: "Henüz mesaj yok.",
			placeholder: "Bir mesaj yaz…",
			send: "Gönder",
			to: "Kime"
		},
		admin: {
			title: "Doğrulama kuyruğu",
			empty: "Bekleyen istek yok.",
			approve: "Onayla",
			reject: "Reddet",
			approved: "Onaylandı",
			rejected: "Reddedildi"
		},
		common: {
			cancel: "İptal",
			save: "Kaydet",
			loading: "Yükleniyor…"
		}
	},
	ar: {
		nav: {
			feed: "الرئيسية",
			brands: "العلامات",
			messages: "الرسائل",
			admin: "المشرف",
			dashboard: "لوحة التحكم",
			awards: "الجوائز",
			post: "نشر",
			signIn: "تسجيل الدخول",
			signOut: "تسجيل الخروج",
			profile: "الملف الشخصي"
		},
		home: {
			subtitle: "مقياس العلامات التجارية. انشر أي شيء عن علامة ودع المجتمع يصدر حكمه مباشرة — إشارة تجربة العميل والعلاقات العامة التي تهم.",
			hook: "كل حكم يقرّب العلامات من الناس. أصدر حكمك. 🔥",
			emptyTitle: "لا يوجد شيء للحكم عليه بعد",
			emptyBodyUser: "كن الأول — اضغط نشر.",
			emptyBodyGuest: "كن الأول — سجّل الدخول وانشر."
		},
		engagement: {
			streak: "سلسلة {{count}} يوم",
			today: "{{count}} اليوم",
			total: "{{count}} الإجمالي",
			next: "{{count}} أحكام أخرى للشارة التالية",
			topCritic: "أنت ناقد بارز — العلامات تستمع. 👑"
		},
		vote: {
			stash: "احتفظ",
			trash: "تخلّص",
			noVotes: "لا أصوات بعد",
			stashPct: "{{pct}}٪ احتفظ",
			stashCount: "{{count}} احتفظ",
			trashCount: "{{count}} تخلّص",
			signInPrompt: "سجّل الدخول لإصدار حكمك.",
			by: "بواسطة {{name}}",
			deletePost: "حذف المنشور",
			deleted: "تم الحذف.",
			voteFailed: "فشل التصويت.",
			deleteFailed: "فشل الحذف."
		},
		submit: {
			trigger: "نشر",
			title: "انشر شيئًا للحكم عليه",
			intro: "أشر إلى علامة، أضف صورة ودع المجتمع يقرر: احتفظ أم تخلّص.",
			fieldTitle: "العنوان",
			titlePh: "هذه الأحذية النيون…",
			brand: "العلامة (اختياري)",
			brandPh: "اختر علامة",
			noBrand: "بدون علامة",
			category: "الفئة (اختياري)",
			categoryPh: "تغليف، إعلان، منتج، خدمة…",
			description: "الوصف (اختياري)",
			descriptionPh: "لماذا يجب الاحتفاظ أو التخلص؟",
			photo: "صورة (اختياري)",
			posting: "جارٍ النشر…",
			submit: "انشر",
			needTitle: "أضف عنوانًا أولًا.",
			posted: "تم النشر! ليبدأ الحكم.",
			error: "حدث خطأ ما."
		},
		auth: {
			continueGoogle: "المتابعة مع Google",
			or: "أو",
			signIn: "تسجيل الدخول",
			signUp: "إنشاء حساب",
			email: "البريد الإلكتروني",
			password: "كلمة المرور",
			displayName: "الاسم الظاهر",
			createAccount: "إنشاء حساب",
			welcome: "أهلًا بعودتك!",
			created: "تم إنشاء الحساب!",
			googleFailed: "فشل تسجيل الدخول عبر Google."
		},
		brand: {
			title: "العلامات",
			subtitle: "علامات موثقة وحكم المجتمع المباشر عليها.",
			create: "إنشاء علامة",
			verified: "موثقة",
			trustScore: "مؤشر الثقة",
			requestVerification: "طلب التوثيق",
			verificationPending: "التوثيق قيد المراجعة",
			message: "مراسلة المالك",
			posts: "منشورات عن هذه العلامة",
			noBrands: "لا توجد علامات بعد. أضف الأولى.",
			website: "الموقع",
			by: "يديرها"
		},
		dashboard: {
			title: "لوحة العلامة",
			subtitle: "أدر العلامات التي تمثلها وتابع انطباع الجمهور مباشرة.",
			noBrands: "لا تدير أي علامة بعد.",
			createFirst: "أنشئ علامتك الأولى",
			newBrand: "علامة جديدة",
			trustScore: "مؤشر الثقة",
			posts: "المنشورات",
			stash: "احتفظ",
			trash: "تخلّص",
			verified: "موثقة",
			unverified: "غير موثقة",
			requestVerification: "طلب التوثيق",
			view: "عرض الصفحة",
			manage: "إدارة"
		},
		awards: {
			title: "جوائز SOT",
			tagline: "حكم الناس، رسميًا.",
			intro: "كل عام تُتوَّج أكثر العلامات ثقة في العالم في جوائز SOT — بقرار أحكام حقيقية من أشخاص حقيقيين.",
			leaderboard: "الترتيب المباشر",
			leaderboardNote: "الترتيب الحالي الذي يحدد جوائز هذا العام.",
			rank: "الترتيب",
			brand: "العلامة",
			score: "مؤشر الثقة",
			categoryTitle: "الفئات",
			cat1: "أكثر علامة موثوقة",
			cat1d: "أعلى مؤشر ثقة خلال العام.",
			cat2: "بطل الجمهور",
			cat2d: "أكثر أحكام الاحتفاظ.",
			cat3: "أكبر تحول",
			cat3d: "أكبر ارتفاع خلال 12 شهرًا.",
			cat4: "النجم الصاعد",
			cat4d: "أفضل علامة جديدة للعام.",
			cta: "مثّل علامتك",
			ctaNote: "تملك علامة؟ طالب بصفحتك وارتقِ في الترتيب."
		},
		messages: {
			title: "الرسائل",
			empty: "لا رسائل بعد.",
			placeholder: "اكتب رسالة…",
			send: "إرسال",
			to: "إلى"
		},
		admin: {
			title: "قائمة التوثيق",
			empty: "لا توجد طلبات معلقة.",
			approve: "قبول",
			reject: "رفض",
			approved: "تم القبول",
			rejected: "تم الرفض"
		},
		common: {
			cancel: "إلغاء",
			save: "حفظ",
			loading: "جارٍ التحميل…"
		}
	},
	hi: {
		nav: {
			feed: "फ़ीड",
			brands: "ब्रांड",
			messages: "संदेश",
			admin: "एडमिन",
			dashboard: "डैशबोर्ड",
			awards: "पुरस्कार",
			post: "पोस्ट करें",
			signIn: "साइन इन",
			signOut: "साइन आउट",
			profile: "प्रोफ़ाइल"
		},
		home: {
			subtitle: "ब्रांड बैरोमीटर। किसी भी ब्रांड के बारे में पोस्ट करें और समुदाय को रीयल टाइम में फैसला सुनाने दें — वही CX और PR संकेत जो मायने रखता है।",
			hook: "हर फैसला ब्रांड्स को लोगों के करीब लाता है। अपना फैसला दें। 🔥",
			emptyTitle: "अभी कुछ भी जांचने को नहीं",
			emptyBodyUser: "पहले बनें — पोस्ट दबाएं।",
			emptyBodyGuest: "पहले बनें — साइन इन करें और पोस्ट करें।"
		},
		engagement: {
			streak: "{{count}} दिन की लय",
			today: "आज {{count}}",
			total: "कुल {{count}}",
			next: "अगले बैज के लिए {{count}} और फैसले",
			topCritic: "आप शीर्ष समीक्षक हैं — ब्रांड सुन रहे हैं। 👑"
		},
		vote: {
			stash: "रखें",
			trash: "फेंकें",
			noVotes: "अभी कोई वोट नहीं",
			stashPct: "{{pct}}% रखें",
			stashCount: "{{count}} रखें",
			trashCount: "{{count}} फेंकें",
			signInPrompt: "फैसला देने के लिए साइन इन करें।",
			by: "{{name}} द्वारा",
			deletePost: "पोस्ट हटाएं",
			deleted: "हटा दिया गया।",
			voteFailed: "वोट विफल।",
			deleteFailed: "हटाना विफल।"
		},
		submit: {
			trigger: "पोस्ट",
			title: "जांचने के लिए कुछ पोस्ट करें",
			intro: "ब्रांड टैग करें, फ़ोटो जोड़ें और समुदाय को तय करने दें: रखें या फेंकें।",
			fieldTitle: "शीर्षक",
			titlePh: "ये नियॉन स्नीकर्स…",
			brand: "ब्रांड (वैकल्पिक)",
			brandPh: "ब्रांड चुनें",
			noBrand: "कोई ब्रांड नहीं",
			category: "श्रेणी (वैकल्पिक)",
			categoryPh: "पैकेजिंग, विज्ञापन, उत्पाद, सेवा…",
			description: "विवरण (वैकल्पिक)",
			descriptionPh: "इसे क्यों रखें या फेंकें?",
			photo: "फ़ोटो (वैकल्पिक)",
			posting: "पोस्ट हो रहा है…",
			submit: "पोस्ट करें",
			needTitle: "पहले शीर्षक दें।",
			posted: "पोस्ट हो गया! फैसला शुरू।",
			error: "कुछ गलत हो गया।"
		},
		auth: {
			continueGoogle: "Google के साथ जारी रखें",
			or: "या",
			signIn: "साइन इन",
			signUp: "साइन अप",
			email: "ईमेल",
			password: "पासवर्ड",
			displayName: "प्रदर्शित नाम",
			createAccount: "खाता बनाएं",
			welcome: "वापसी पर स्वागत है!",
			created: "खाता बन गया!",
			googleFailed: "Google साइन-इन विफल।"
		},
		brand: {
			title: "ब्रांड",
			subtitle: "सत्यापित ब्रांड और समुदाय का लाइव फैसला।",
			create: "ब्रांड बनाएं",
			verified: "सत्यापित",
			trustScore: "विश्वास स्कोर",
			requestVerification: "सत्यापन का अनुरोध",
			verificationPending: "सत्यापन लंबित",
			message: "मालिक को संदेश",
			posts: "इस ब्रांड पर पोस्ट",
			noBrands: "अभी कोई ब्रांड नहीं। पहला जोड़ें।",
			website: "वेबसाइट",
			by: "प्रबंधित"
		},
		dashboard: {
			title: "ब्रांड डैशबोर्ड",
			subtitle: "अपने ब्रांड प्रबंधित करें और लाइव भावना देखें।",
			noBrands: "आप अभी कोई ब्रांड प्रबंधित नहीं करते।",
			createFirst: "अपना पहला ब्रांड बनाएं",
			newBrand: "नया ब्रांड",
			trustScore: "विश्वास स्कोर",
			posts: "पोस्ट",
			stash: "रखें",
			trash: "फेंकें",
			verified: "सत्यापित",
			unverified: "असत्यापित",
			requestVerification: "सत्यापन का अनुरोध",
			view: "पेज देखें",
			manage: "प्रबंधित करें"
		},
		awards: {
			title: "SOT पुरस्कार",
			tagline: "जनता का फैसला, अब आधिकारिक।",
			intro: "हर साल दुनिया के सबसे भरोसेमंद ब्रांड SOT पुरस्कारों में सम्मानित होते हैं — पूरी तरह असली लोगों के असली फैसलों से तय।",
			leaderboard: "लाइव लीडरबोर्ड",
			leaderboardNote: "इस साल के पुरस्कारों को आकार देने वाली मौजूदा स्थिति।",
			rank: "रैंक",
			brand: "ब्रांड",
			score: "विश्वास स्कोर",
			categoryTitle: "श्रेणियां",
			cat1: "सबसे भरोसेमंद ब्रांड",
			cat1d: "साल का सर्वोच्च विश्वास स्कोर।",
			cat2: "जनता का चैंपियन",
			cat2d: "सबसे ज्यादा 'रखें' फैसले।",
			cat3: "सबसे बड़ा बदलाव",
			cat3d: "12 महीनों में सबसे बड़ी बढ़त।",
			cat4: "उभरता सितारा",
			cat4d: "साल का सर्वश्रेष्ठ नया ब्रांड।",
			cta: "अपने ब्रांड का प्रतिनिधित्व करें",
			ctaNote: "ब्रांड आपका है? पेज क्लेम करें और आगे बढ़ें।"
		},
		messages: {
			title: "संदेश",
			empty: "अभी कोई संदेश नहीं।",
			placeholder: "संदेश लिखें…",
			send: "भेजें",
			to: "प्रति"
		},
		admin: {
			title: "सत्यापन कतार",
			empty: "कोई लंबित अनुरोध नहीं।",
			approve: "स्वीकृत करें",
			reject: "अस्वीकार करें",
			approved: "स्वीकृत",
			rejected: "अस्वीकृत"
		},
		common: {
			cancel: "रद्द करें",
			save: "सहेजें",
			loading: "लोड हो रहा है…"
		}
	},
	zh: {
		nav: {
			feed: "动态",
			brands: "品牌",
			messages: "消息",
			admin: "管理",
			dashboard: "仪表板",
			awards: "大奖",
			post: "发布",
			signIn: "登录",
			signOut: "退出",
			profile: "个人资料"
		},
		home: {
			subtitle: "品牌晴雨表。发布任何与品牌有关的内容，让社区实时给出裁决——这才是真正重要的客户体验与公关信号。",
			hook: "每一次裁决都让品牌更贴近用户。投出你的一票。🔥",
			emptyTitle: "暂时没有可评判的内容",
			emptyBodyUser: "抢先一步——点击发布。",
			emptyBodyGuest: "抢先一步——登录后发布内容。"
		},
		engagement: {
			streak: "连续 {{count}} 天",
			today: "今日 {{count}}",
			total: "累计 {{count}}",
			next: "再有 {{count}} 次裁决即可获得新徽章",
			topCritic: "你是顶级评论者——品牌都在倾听。👑"
		},
		vote: {
			stash: "留下",
			trash: "丢掉",
			noVotes: "暂无投票",
			stashPct: "{{pct}}% 留下",
			stashCount: "{{count}} 留下",
			trashCount: "{{count}} 丢掉",
			signInPrompt: "登录后即可裁决。",
			by: "作者 {{name}}",
			deletePost: "删除帖子",
			deleted: "已删除。",
			voteFailed: "投票失败。",
			deleteFailed: "删除失败。"
		},
		submit: {
			trigger: "发布",
			title: "发布内容接受评判",
			intro: "标记品牌、上传照片，让社区决定：留下还是丢掉。",
			fieldTitle: "标题",
			titlePh: "这双霓虹球鞋…",
			brand: "品牌（可选）",
			brandPh: "选择品牌",
			noBrand: "无品牌",
			category: "分类（可选）",
			categoryPh: "包装、广告、产品、服务…",
			description: "描述（可选）",
			descriptionPh: "为什么应该留下或丢掉？",
			photo: "照片（可选）",
			posting: "发布中…",
			submit: "发布",
			needTitle: "请先填写标题。",
			posted: "已发布！裁决开始。",
			error: "出错了。"
		},
		auth: {
			continueGoogle: "使用 Google 继续",
			or: "或",
			signIn: "登录",
			signUp: "注册",
			email: "邮箱",
			password: "密码",
			displayName: "显示名称",
			createAccount: "创建账户",
			welcome: "欢迎回来！",
			created: "账户已创建！",
			googleFailed: "Google 登录失败。"
		},
		brand: {
			title: "品牌",
			subtitle: "已认证品牌与社区的实时裁决。",
			create: "创建品牌",
			verified: "已认证",
			trustScore: "信任分",
			requestVerification: "申请认证",
			verificationPending: "认证审核中",
			message: "联系负责人",
			posts: "关于该品牌的帖子",
			noBrands: "暂无品牌，快来添加第一个。",
			website: "官网",
			by: "管理者"
		},
		dashboard: {
			title: "品牌仪表板",
			subtitle: "管理你代表的品牌并追踪实时口碑。",
			noBrands: "你还没有管理任何品牌。",
			createFirst: "创建第一个品牌",
			newBrand: "新建品牌",
			trustScore: "信任分",
			posts: "帖子",
			stash: "留下",
			trash: "丢掉",
			verified: "已认证",
			unverified: "未认证",
			requestVerification: "申请认证",
			view: "查看页面",
			manage: "管理"
		},
		awards: {
			title: "SOT 大奖",
			tagline: "人民的裁决，正式加冕。",
			intro: "每年，全球最受信任的品牌都会在 SOT 大奖上加冕——完全由真实用户的真实裁决决定。",
			leaderboard: "实时排行榜",
			leaderboardNote: "决定今年大奖的当前排名。",
			rank: "排名",
			brand: "品牌",
			score: "信任分",
			categoryTitle: "奖项类别",
			cat1: "最受信任品牌",
			cat1d: "全年最高信任分。",
			cat2: "人民之选",
			cat2d: "获得最多“留下”裁决。",
			cat3: "最大逆转",
			cat3d: "12 个月内信任分涨幅最大。",
			cat4: "新星品牌",
			cat4d: "年度最佳新品牌。",
			cta: "代表你的品牌",
			ctaNote: "拥有品牌？认领页面，冲击榜单。"
		},
		messages: {
			title: "消息",
			empty: "暂无消息。",
			placeholder: "写条消息…",
			send: "发送",
			to: "收件人"
		},
		admin: {
			title: "认证队列",
			empty: "没有待处理的申请。",
			approve: "通过",
			reject: "拒绝",
			approved: "已通过",
			rejected: "已拒绝"
		},
		common: {
			cancel: "取消",
			save: "保存",
			loading: "加载中…"
		}
	},
	ja: {
		nav: {
			feed: "フィード",
			brands: "ブランド",
			messages: "メッセージ",
			admin: "管理",
			dashboard: "ダッシュボード",
			awards: "アワード",
			post: "投稿",
			signIn: "ログイン",
			signOut: "ログアウト",
			profile: "プロフィール"
		},
		home: {
			subtitle: "ブランドの気圧計。ブランドについて何でも投稿し、コミュニティにリアルタイムで判定してもらおう——本当に重要なCXとPRのシグナル。",
			hook: "すべての判定がブランドを人々に近づけます。あなたの判定を。🔥",
			emptyTitle: "まだ判定するものがありません",
			emptyBodyUser: "最初の一人に——投稿を押そう。",
			emptyBodyGuest: "最初の一人に——ログインして投稿しよう。"
		},
		engagement: {
			streak: "{{count}}日連続",
			today: "本日 {{count}}",
			total: "累計 {{count}}",
			next: "次のバッジまであと {{count}} 判定",
			topCritic: "あなたはトップ評論家——ブランドが聞いています。👑"
		},
		vote: {
			stash: "キープ",
			trash: "処分",
			noVotes: "まだ投票なし",
			stashPct: "{{pct}}% キープ",
			stashCount: "{{count}} キープ",
			trashCount: "{{count}} 処分",
			signInPrompt: "判定するにはログインしてください。",
			by: "投稿者 {{name}}",
			deletePost: "投稿を削除",
			deleted: "削除しました。",
			voteFailed: "投票に失敗しました。",
			deleteFailed: "削除に失敗しました。"
		},
		submit: {
			trigger: "投稿",
			title: "判定してもらう投稿",
			intro: "ブランドをタグ付けし、写真を追加して、コミュニティに決めてもらおう：キープか処分か。",
			fieldTitle: "タイトル",
			titlePh: "このネオンスニーカー…",
			brand: "ブランド（任意）",
			brandPh: "ブランドを選択",
			noBrand: "ブランドなし",
			category: "カテゴリ（任意）",
			categoryPh: "パッケージ、広告、製品、サービス…",
			description: "説明（任意）",
			descriptionPh: "なぜキープ／処分すべき？",
			photo: "写真（任意）",
			posting: "投稿中…",
			submit: "投稿する",
			needTitle: "まずタイトルを入力してください。",
			posted: "投稿しました！判定開始。",
			error: "問題が発生しました。"
		},
		auth: {
			continueGoogle: "Google で続行",
			or: "または",
			signIn: "ログイン",
			signUp: "新規登録",
			email: "メール",
			password: "パスワード",
			displayName: "表示名",
			createAccount: "アカウント作成",
			welcome: "おかえりなさい！",
			created: "アカウントを作成しました！",
			googleFailed: "Google ログインに失敗しました。"
		},
		brand: {
			title: "ブランド",
			subtitle: "認証済みブランドとコミュニティのライブ判定。",
			create: "ブランドを作成",
			verified: "認証済み",
			trustScore: "信頼スコア",
			requestVerification: "認証をリクエスト",
			verificationPending: "認証審査中",
			message: "オーナーにメッセージ",
			posts: "このブランドへの投稿",
			noBrands: "まだブランドがありません。最初の一つを追加。",
			website: "ウェブサイト",
			by: "運営"
		},
		dashboard: {
			title: "ブランドダッシュボード",
			subtitle: "担当ブランドを管理し、ライブの評判を把握。",
			noBrands: "まだブランドを管理していません。",
			createFirst: "最初のブランドを作成",
			newBrand: "新規ブランド",
			trustScore: "信頼スコア",
			posts: "投稿",
			stash: "キープ",
			trash: "処分",
			verified: "認証済み",
			unverified: "未認証",
			requestVerification: "認証をリクエスト",
			view: "ページを見る",
			manage: "管理"
		},
		awards: {
			title: "SOT アワード",
			tagline: "人々の判定を、公式に。",
			intro: "毎年、世界で最も信頼されるブランドが SOT アワードで表彰されます——決めるのは実在の人々のリアルな判定だけ。",
			leaderboard: "ライブランキング",
			leaderboardNote: "今年のアワードを左右する現在の順位。",
			rank: "順位",
			brand: "ブランド",
			score: "信頼スコア",
			categoryTitle: "部門",
			cat1: "最も信頼されるブランド",
			cat1d: "年間最高の信頼スコア。",
			cat2: "ピープルズ・チャンピオン",
			cat2d: "最も多くのキープ判定。",
			cat3: "最大のターンアラウンド",
			cat3d: "12か月で最大の上昇。",
			cat4: "ライジングスター",
			cat4d: "年間最優秀新ブランド。",
			cta: "自社ブランドを代表する",
			ctaNote: "ブランドをお持ちですか？ページを取得してランクを上げよう。"
		},
		messages: {
			title: "メッセージ",
			empty: "まだメッセージはありません。",
			placeholder: "メッセージを書く…",
			send: "送信",
			to: "宛先"
		},
		admin: {
			title: "認証キュー",
			empty: "保留中のリクエストはありません。",
			approve: "承認",
			reject: "却下",
			approved: "承認済み",
			rejected: "却下済み"
		},
		common: {
			cancel: "キャンセル",
			save: "保存",
			loading: "読み込み中…"
		}
	},
	ko: {
		nav: {
			feed: "피드",
			brands: "브랜드",
			messages: "메시지",
			admin: "관리자",
			dashboard: "대시보드",
			awards: "어워드",
			post: "게시",
			signIn: "로그인",
			signOut: "로그아웃",
			profile: "프로필"
		},
		home: {
			subtitle: "브랜드 바로미터. 브랜드에 대해 무엇이든 올리고 커뮤니티의 실시간 판정을 받아보세요 — 진짜 중요한 CX·PR 신호입니다.",
			hook: "모든 판정이 브랜드를 사람들에게 가깝게 만듭니다. 당신의 판정을 남기세요. 🔥",
			emptyTitle: "아직 판정할 것이 없습니다",
			emptyBodyUser: "첫 번째가 되어보세요 — 게시를 눌러보세요.",
			emptyBodyGuest: "첫 번째가 되어보세요 — 로그인 후 게시하세요."
		},
		engagement: {
			streak: "{{count}}일 연속",
			today: "오늘 {{count}}",
			total: "총 {{count}}",
			next: "다음 배지까지 {{count}}회 남음",
			topCritic: "당신은 최고 평론가입니다 — 브랜드가 듣고 있어요. 👑"
		},
		vote: {
			stash: "보관",
			trash: "폐기",
			noVotes: "아직 투표 없음",
			stashPct: "{{pct}}% 보관",
			stashCount: "{{count}} 보관",
			trashCount: "{{count}} 폐기",
			signInPrompt: "판정하려면 로그인하세요.",
			by: "{{name}} 작성",
			deletePost: "게시물 삭제",
			deleted: "삭제됨.",
			voteFailed: "투표 실패.",
			deleteFailed: "삭제 실패."
		},
		submit: {
			trigger: "게시",
			title: "판정받을 내용을 올리세요",
			intro: "브랜드를 태그하고 사진을 추가해 커뮤니티가 결정하게 하세요: 보관 또는 폐기.",
			fieldTitle: "제목",
			titlePh: "이 네온 스니커즈…",
			brand: "브랜드 (선택)",
			brandPh: "브랜드 선택",
			noBrand: "브랜드 없음",
			category: "카테고리 (선택)",
			categoryPh: "패키지, 광고, 제품, 서비스…",
			description: "설명 (선택)",
			descriptionPh: "왜 보관하거나 폐기해야 하나요?",
			photo: "사진 (선택)",
			posting: "게시 중…",
			submit: "게시하기",
			needTitle: "먼저 제목을 입력하세요.",
			posted: "게시 완료! 판정을 시작하세요.",
			error: "문제가 발생했습니다."
		},
		auth: {
			continueGoogle: "Google로 계속하기",
			or: "또는",
			signIn: "로그인",
			signUp: "가입",
			email: "이메일",
			password: "비밀번호",
			displayName: "표시 이름",
			createAccount: "계정 만들기",
			welcome: "다시 오신 것을 환영합니다!",
			created: "계정이 생성되었습니다!",
			googleFailed: "Google 로그인 실패."
		},
		brand: {
			title: "브랜드",
			subtitle: "인증된 브랜드와 커뮤니티의 실시간 판정.",
			create: "브랜드 만들기",
			verified: "인증됨",
			trustScore: "신뢰 점수",
			requestVerification: "인증 요청",
			verificationPending: "인증 대기 중",
			message: "담당자에게 메시지",
			posts: "이 브랜드 관련 게시물",
			noBrands: "아직 브랜드가 없습니다. 첫 번째를 추가하세요.",
			website: "웹사이트",
			by: "관리자"
		},
		dashboard: {
			title: "브랜드 대시보드",
			subtitle: "담당 브랜드를 관리하고 실시간 여론을 확인하세요.",
			noBrands: "아직 관리 중인 브랜드가 없습니다.",
			createFirst: "첫 브랜드 만들기",
			newBrand: "새 브랜드",
			trustScore: "신뢰 점수",
			posts: "게시물",
			stash: "보관",
			trash: "폐기",
			verified: "인증됨",
			unverified: "미인증",
			requestVerification: "인증 요청",
			view: "페이지 보기",
			manage: "관리"
		},
		awards: {
			title: "SOT 어워드",
			tagline: "사람들의 판정, 공식이 되다.",
			intro: "매년 세계에서 가장 신뢰받는 브랜드가 SOT 어워드에서 선정됩니다 — 오직 실제 사용자들의 진짜 판정으로.",
			leaderboard: "실시간 순위",
			leaderboardNote: "올해 어워드를 결정하는 현재 순위.",
			rank: "순위",
			brand: "브랜드",
			score: "신뢰 점수",
			categoryTitle: "부문",
			cat1: "가장 신뢰받는 브랜드",
			cat1d: "연간 최고 신뢰 점수.",
			cat2: "국민 챔피언",
			cat2d: "가장 많은 보관 판정.",
			cat3: "최고의 반전",
			cat3d: "12개월간 최대 상승.",
			cat4: "라이징 스타",
			cat4d: "올해의 신규 브랜드.",
			cta: "브랜드를 대표하세요",
			ctaNote: "브랜드가 있나요? 페이지를 인증하고 순위를 올리세요."
		},
		messages: {
			title: "메시지",
			empty: "아직 메시지가 없습니다.",
			placeholder: "메시지를 입력…",
			send: "보내기",
			to: "받는 사람"
		},
		admin: {
			title: "인증 대기열",
			empty: "대기 중인 요청이 없습니다.",
			approve: "승인",
			reject: "거절",
			approved: "승인됨",
			rejected: "거절됨"
		},
		common: {
			cancel: "취소",
			save: "저장",
			loading: "불러오는 중…"
		}
	},
	id: {
		nav: {
			feed: "Beranda",
			brands: "Merek",
			messages: "Pesan",
			admin: "Admin",
			dashboard: "Dasbor",
			awards: "Penghargaan",
			post: "Posting",
			signIn: "Masuk",
			signOut: "Keluar",
			profile: "Profil"
		},
		home: {
			subtitle: "Barometer merek. Posting apa pun tentang sebuah merek dan biarkan komunitas memberi vonis secara langsung — sinyal CX & PR yang penting.",
			hook: "Setiap vonis mendekatkan merek dengan penggunanya. Berikan vonismu. 🔥",
			emptyTitle: "Belum ada yang bisa dinilai",
			emptyBodyUser: "Jadilah yang pertama — tekan Posting.",
			emptyBodyGuest: "Jadilah yang pertama — masuk dan posting."
		},
		engagement: {
			streak: "Rentetan {{count}} hari",
			today: "{{count}} hari ini",
			total: "{{count}} total",
			next: "{{count}} vonis lagi menuju lencana berikutnya",
			topCritic: "Kamu kritikus teratas — merek mendengarkan. 👑"
		},
		vote: {
			stash: "Simpan",
			trash: "Buang",
			noVotes: "Belum ada suara",
			stashPct: "{{pct}}% simpan",
			stashCount: "{{count}} simpan",
			trashCount: "{{count}} buang",
			signInPrompt: "Masuk untuk memberi vonis.",
			by: "oleh {{name}}",
			deletePost: "Hapus postingan",
			deleted: "Dihapus.",
			voteFailed: "Gagal memilih.",
			deleteFailed: "Gagal menghapus."
		},
		submit: {
			trigger: "Posting",
			title: "Posting sesuatu untuk dinilai",
			intro: "Tandai merek, tambahkan foto, dan biarkan komunitas memutuskan: simpan atau buang.",
			fieldTitle: "Judul",
			titlePh: "Sepatu neon ini…",
			brand: "Merek (opsional)",
			brandPh: "Pilih merek",
			noBrand: "Tanpa merek",
			category: "Kategori (opsional)",
			categoryPh: "Kemasan, iklan, produk, layanan…",
			description: "Deskripsi (opsional)",
			descriptionPh: "Kenapa harus disimpan atau dibuang?",
			photo: "Foto (opsional)",
			posting: "Mengirim…",
			submit: "Posting",
			needTitle: "Beri judul dulu.",
			posted: "Terkirim! Vonis dimulai.",
			error: "Terjadi kesalahan."
		},
		auth: {
			continueGoogle: "Lanjut dengan Google",
			or: "atau",
			signIn: "Masuk",
			signUp: "Daftar",
			email: "Email",
			password: "Kata sandi",
			displayName: "Nama tampilan",
			createAccount: "Buat akun",
			welcome: "Selamat datang kembali!",
			created: "Akun dibuat!",
			googleFailed: "Gagal masuk dengan Google."
		},
		brand: {
			title: "Merek",
			subtitle: "Merek terverifikasi dan vonis langsung dari komunitas.",
			create: "Buat merek",
			verified: "Terverifikasi",
			trustScore: "Skor kepercayaan",
			requestVerification: "Ajukan verifikasi",
			verificationPending: "Verifikasi menunggu",
			message: "Pesan pemilik",
			posts: "Postingan tentang merek ini",
			noBrands: "Belum ada merek. Tambahkan yang pertama.",
			website: "Situs web",
			by: "Dikelola oleh"
		},
		dashboard: {
			title: "Dasbor merek",
			subtitle: "Kelola merek yang kamu wakili dan pantau sentimennya.",
			noBrands: "Kamu belum mengelola merek apa pun.",
			createFirst: "Buat merek pertamamu",
			newBrand: "Merek baru",
			trustScore: "Skor kepercayaan",
			posts: "Postingan",
			stash: "Simpan",
			trash: "Buang",
			verified: "Terverifikasi",
			unverified: "Belum terverifikasi",
			requestVerification: "Ajukan verifikasi",
			view: "Lihat halaman",
			manage: "Kelola"
		},
		awards: {
			title: "SOT Awards",
			tagline: "Vonis rakyat, kini resmi.",
			intro: "Setiap tahun, merek paling tepercaya di dunia dinobatkan di SOT Awards — ditentukan sepenuhnya oleh vonis nyata dari orang nyata.",
			leaderboard: "Papan peringkat langsung",
			leaderboardNote: "Peringkat saat ini yang membentuk penghargaan tahun ini.",
			rank: "Peringkat",
			brand: "Merek",
			score: "Skor kepercayaan",
			categoryTitle: "Kategori",
			cat1: "Merek paling tepercaya",
			cat1d: "Skor kepercayaan tertinggi tahun ini.",
			cat2: "Juara rakyat",
			cat2d: "Vonis Simpan terbanyak.",
			cat3: "Kebangkitan terbesar",
			cat3d: "Kenaikan terbesar dalam 12 bulan.",
			cat4: "Bintang baru",
			cat4d: "Merek baru terbaik tahun ini.",
			cta: "Wakili merekmu",
			ctaNote: "Punya merek? Klaim halamanmu dan naik peringkat."
		},
		messages: {
			title: "Pesan",
			empty: "Belum ada pesan.",
			placeholder: "Tulis pesan…",
			send: "Kirim",
			to: "Kepada"
		},
		admin: {
			title: "Antrean verifikasi",
			empty: "Tidak ada permintaan tertunda.",
			approve: "Setujui",
			reject: "Tolak",
			approved: "Disetujui",
			rejected: "Ditolak"
		},
		common: {
			cancel: "Batal",
			save: "Simpan",
			loading: "Memuat…"
		}
	},
	sw: {
		nav: {
			feed: "Mlisho",
			brands: "Chapa",
			messages: "Ujumbe",
			admin: "Msimamizi",
			dashboard: "Dashibodi",
			awards: "Tuzo",
			post: "Chapisha",
			signIn: "Ingia",
			signOut: "Toka",
			profile: "Wasifu"
		},
		home: {
			subtitle: "Kipimo cha chapa. Chapisha chochote kuhusu chapa na uache jamii itoe uamuzi papo hapo — ishara ya CX na PR inayohesabika.",
			hook: "Kila uamuzi huleta chapa karibu na watu wake. Toa wako. 🔥",
			emptyTitle: "Bado hakuna cha kuhukumu",
			emptyBodyUser: "Kuwa wa kwanza — bonyeza Chapisha.",
			emptyBodyGuest: "Kuwa wa kwanza — ingia na uchapishe."
		},
		engagement: {
			streak: "Mfululizo wa siku {{count}}",
			today: "{{count}} leo",
			total: "{{count}} jumla",
			next: "Maamuzi {{count}} zaidi hadi beji yako ijayo",
			topCritic: "Wewe ni mhakiki bora — chapa zinasikiliza. 👑"
		},
		vote: {
			stash: "Hifadhi",
			trash: "Tupa",
			noVotes: "Bado hakuna kura",
			stashPct: "{{pct}}% hifadhi",
			stashCount: "{{count}} hifadhi",
			trashCount: "{{count}} tupa",
			signInPrompt: "Ingia ili utoe uamuzi wako.",
			by: "na {{name}}",
			deletePost: "Futa chapisho",
			deleted: "Imefutwa.",
			voteFailed: "Kupiga kura kumeshindikana.",
			deleteFailed: "Kufuta kumeshindikana."
		},
		submit: {
			trigger: "Chapisha",
			title: "Chapisha kitu kihukumiwe",
			intro: "Taja chapa, ongeza picha, na uache jamii iamue: hifadhi au tupa.",
			fieldTitle: "Kichwa",
			titlePh: "Viatu hivi vya neon…",
			brand: "Chapa (hiari)",
			brandPh: "Chagua chapa",
			noBrand: "Hakuna chapa",
			category: "Kategoria (hiari)",
			categoryPh: "Ufungashaji, tangazo, bidhaa, huduma…",
			description: "Maelezo (hiari)",
			descriptionPh: "Kwa nini ihifadhiwe au itupwe?",
			photo: "Picha (hiari)",
			posting: "Inachapisha…",
			submit: "Chapisha",
			needTitle: "Ipe kichwa kwanza.",
			posted: "Imechapishwa! Uamuzi uanze.",
			error: "Kuna hitilafu."
		},
		auth: {
			continueGoogle: "Endelea na Google",
			or: "au",
			signIn: "Ingia",
			signUp: "Jisajili",
			email: "Barua pepe",
			password: "Nenosiri",
			displayName: "Jina la kuonyesha",
			createAccount: "Fungua akaunti",
			welcome: "Karibu tena!",
			created: "Akaunti imeundwa!",
			googleFailed: "Kuingia kwa Google kumeshindikana."
		},
		brand: {
			title: "Chapa",
			subtitle: "Chapa zilizothibitishwa na uamuzi wa jamii papo hapo.",
			create: "Unda chapa",
			verified: "Imethibitishwa",
			trustScore: "Alama ya imani",
			requestVerification: "Omba uthibitisho",
			verificationPending: "Uthibitisho unasubiri",
			message: "Tuma ujumbe kwa mmiliki",
			posts: "Machapisho kuhusu chapa hii",
			noBrands: "Bado hakuna chapa. Ongeza ya kwanza.",
			website: "Tovuti",
			by: "Inasimamiwa na"
		},
		dashboard: {
			title: "Dashibodi ya chapa",
			subtitle: "Simamia chapa unazowakilisha na fuatilia maoni papo hapo.",
			noBrands: "Bado husimamii chapa yoyote.",
			createFirst: "Unda chapa yako ya kwanza",
			newBrand: "Chapa mpya",
			trustScore: "Alama ya imani",
			posts: "Machapisho",
			stash: "Hifadhi",
			trash: "Tupa",
			verified: "Imethibitishwa",
			unverified: "Haijathibitishwa",
			requestVerification: "Omba uthibitisho",
			view: "Tazama ukurasa",
			manage: "Simamia"
		},
		awards: {
			title: "Tuzo za SOT",
			tagline: "Uamuzi wa watu, sasa rasmi.",
			intro: "Kila mwaka, chapa zinazoaminika zaidi duniani hutunukiwa Tuzo za SOT — zikiamuliwa na maamuzi halisi ya watu halisi.",
			leaderboard: "Jedwali la moja kwa moja",
			leaderboardNote: "Nafasi za sasa zinazounda tuzo za mwaka huu.",
			rank: "Nafasi",
			brand: "Chapa",
			score: "Alama ya imani",
			categoryTitle: "Kategoria za tuzo",
			cat1: "Chapa inayoaminika zaidi",
			cat1d: "Alama ya juu zaidi ya imani mwakani.",
			cat2: "Bingwa wa watu",
			cat2d: "Maamuzi mengi zaidi ya Hifadhi.",
			cat3: "Mabadiliko makubwa",
			cat3d: "Ongezeko kubwa zaidi kwa miezi 12.",
			cat4: "Nyota inayochomoza",
			cat4d: "Chapa mpya bora ya mwaka.",
			cta: "Wakilisha chapa yako",
			ctaNote: "Una chapa? Dai ukurasa wako na panda jedwali."
		},
		messages: {
			title: "Ujumbe",
			empty: "Bado hakuna ujumbe.",
			placeholder: "Andika ujumbe…",
			send: "Tuma",
			to: "Kwa"
		},
		admin: {
			title: "Foleni ya uthibitisho",
			empty: "Hakuna maombi yanayosubiri.",
			approve: "Idhinisha",
			reject: "Kataa",
			approved: "Imeidhinishwa",
			rejected: "Imekataliwa"
		},
		common: {
			cancel: "Ghairi",
			save: "Hifadhi",
			loading: "Inapakia…"
		}
	},
	zu: {
		nav: {
			feed: "Ifidi",
			brands: "Amabhrendi",
			messages: "Imilayezo",
			admin: "Umlawuli",
			dashboard: "Ideshubhodi",
			awards: "Imiklomelo",
			post: "Thumela",
			signIn: "Ngena",
			signOut: "Phuma",
			profile: "Iphrofayela"
		},
		home: {
			subtitle: "Isikali samabhrendi. Thumela noma yini ngebhrendi bese uvumela umphakathi unikeze isinqumo sawo ngesikhathi sangempela — uphawu lwe-CX ne-PR olubalulekile.",
			hook: "Sonke isinqumo siletha amabhrendi eduze nabantu. Nikeza esakho. 🔥",
			emptyTitle: "Ayikho into yokwahlulela okwamanje",
			emptyBodyUser: "Yiba owokuqala — cindezela u-Thumela.",
			emptyBodyGuest: "Yiba owokuqala — ngena bese uthumela."
		},
		engagement: {
			streak: "Uchungechunge lwezinsuku ezingu-{{count}}",
			today: "{{count}} namuhla",
			total: "{{count}} sekukonke",
			next: "Izinqumo ezingu-{{count}} ukuze uthole ibheji elilandelayo",
			topCritic: "Ungumhluzi ophezulu — amabhrendi ayalalela. 👑"
		},
		vote: {
			stash: "Gcina",
			trash: "Lahla",
			noVotes: "Awekho amavoti okwamanje",
			stashPct: "{{pct}}% gcina",
			stashCount: "{{count}} gcina",
			trashCount: "{{count}} lahla",
			signInPrompt: "Ngena ukuze unikeze isinqumo sakho.",
			by: "ngu-{{name}}",
			deletePost: "Susa okuthunyelwe",
			deleted: "Kususiwe.",
			voteFailed: "Ukuvota kwehlulekile.",
			deleteFailed: "Ukususa kwehlulekile."
		},
		submit: {
			trigger: "Thumela",
			title: "Thumela okuthile ukuze kwahlulelwe",
			intro: "Maka ibhrendi, engeza isithombe, bese uvumela umphakathi unqume: gcina noma lahla.",
			fieldTitle: "Isihloko",
			titlePh: "Lezi zicathulo ze-neon…",
			brand: "Ibhrendi (kuyazikhethela)",
			brandPh: "Khetha ibhrendi",
			noBrand: "Alikho ibhrendi",
			category: "Isigaba (kuyazikhethela)",
			categoryPh: "Ukupakisha, isikhangiso, umkhiqizo, insizakalo…",
			description: "Incazelo (kuyazikhethela)",
			descriptionPh: "Kungani kufanele kugcinwe noma kulahlwe?",
			photo: "Isithombe (kuyazikhethela)",
			posting: "Iyathumela…",
			submit: "Thumela",
			needTitle: "Nikeza isihloko kuqala.",
			posted: "Kuthunyelwe! Ake kuqale isinqumo.",
			error: "Kukhona okungahambanga kahle."
		},
		auth: {
			continueGoogle: "Qhubeka nge-Google",
			or: "noma",
			signIn: "Ngena",
			signUp: "Bhalisa",
			email: "I-imeyili",
			password: "Iphasiwedi",
			displayName: "Igama elibonakalayo",
			createAccount: "Dala i-akhawunti",
			welcome: "Siyakwamukela futhi!",
			created: "I-akhawunti idaliwe!",
			googleFailed: "Ukungena nge-Google kwehlulekile."
		},
		brand: {
			title: "Amabhrendi",
			subtitle: "Amabhrendi aqinisekisiwe nesinqumo somphakathi esibukhoma.",
			create: "Dala ibhrendi",
			verified: "Kuqinisekisiwe",
			trustScore: "Isikolo sokwethembeka",
			requestVerification: "Cela ukuqinisekiswa",
			verificationPending: "Ukuqinisekiswa kusalindile",
			message: "Thumela umlayezo kumnikazi",
			posts: "Okuthunyelwe ngale bhrendi",
			noBrands: "Awekho amabhrendi okwamanje. Yengeza elokuqala.",
			website: "Iwebhusayithi",
			by: "Iphethwe ngu"
		},
		dashboard: {
			title: "Ideshubhodi yebhrendi",
			subtitle: "Phatha amabhrendi owamele bese ulandelela imizwa yabantu.",
			noBrands: "Awukaphathi bhrendi okwamanje.",
			createFirst: "Dala ibhrendi lakho lokuqala",
			newBrand: "Ibhrendi elisha",
			trustScore: "Isikolo sokwethembeka",
			posts: "Okuthunyelwe",
			stash: "Gcina",
			trash: "Lahla",
			verified: "Kuqinisekisiwe",
			unverified: "Akuqinisekisiwe",
			requestVerification: "Cela ukuqinisekiswa",
			view: "Buka ikhasi",
			manage: "Phatha"
		},
		awards: {
			title: "Imiklomelo ye-SOT",
			tagline: "Isinqumo sabantu, sesisemthethweni.",
			intro: "Njalo ngonyaka, amabhrendi athenjwa kakhulu emhlabeni aklonyeliswa kwi-SOT Awards — anqunywa yizinqumo zangempela zabantu bangempela.",
			leaderboard: "Uhlu lwabaholayo",
			leaderboardNote: "Izikhundla zamanje ezakha imiklomelo yalo nyaka.",
			rank: "Isikhundla",
			brand: "Ibhrendi",
			score: "Isikolo sokwethembeka",
			categoryTitle: "Izigaba zemiklomelo",
			cat1: "Ibhrendi elithenjwa kakhulu",
			cat1d: "Isikolo esiphakeme sokwethembeka onyakeni.",
			cat2: "Iqhawe labantu",
			cat2d: "Izinqumo eziningi zokuGcina.",
			cat3: "Ushintsho olukhulu",
			cat3d: "Ukukhuphuka okukhulu ezinyangeni ezingu-12.",
			cat4: "Inkanyezi ekhulayo",
			cat4d: "Ibhrendi elisha elingcono kakhulu.",
			cta: "Mela ibhrendi lakho",
			ctaNote: "Unebhrendi? Thatha ikhasi lakho ukhuphuke ohlwini."
		},
		messages: {
			title: "Imilayezo",
			empty: "Ayikho imilayezo okwamanje.",
			placeholder: "Bhala umlayezo…",
			send: "Thumela",
			to: "Ku"
		},
		admin: {
			title: "Ulayini wokuqinisekisa",
			empty: "Azikho izicelo ezilindile.",
			approve: "Vuma",
			reject: "Yenqaba",
			approved: "Kuvunyiwe",
			rejected: "Kwenqatshiwe"
		},
		common: {
			cancel: "Khansela",
			save: "Londoloza",
			loading: "Iyalayisha…"
		}
	},
	xh: {
		nav: {
			feed: "Ifidi",
			brands: "Iimpawu",
			messages: "Imiyalezo",
			admin: "Umlawuli",
			dashboard: "Ideshbhodi",
			awards: "Amabhaso",
			post: "Thumela",
			signIn: "Ngena",
			signOut: "Phuma",
			profile: "Iprofayile"
		},
		home: {
			subtitle: "Isikali seempawu. Thumela nantoni na ngempawu uze uvumele uluntu lunike isigwebo salo ngoko nangoko.",
			hook: "Sonke isigwebo sisondeza iimpawu ebantwini. Nika esakho. 🔥",
			emptyTitle: "Akukho nto yokugweba okwangoku",
			emptyBodyUser: "Yiba ngowokuqala — cofa uThumela.",
			emptyBodyGuest: "Yiba ngowokuqala — ngena uze uthumele."
		},
		engagement: {
			streak: "Ulandelelwano lweentsuku ezingu-{{count}}",
			today: "{{count}} namhlanje",
			total: "{{count}} iyonke",
			next: "Ezinye izigwebo ezingu-{{count}} ukuya kwibheji elandelayo",
			topCritic: "Ungumhlalutyi ophezulu — iimpawu ziyaphulaphula. 👑"
		},
		vote: {
			stash: "Gcina",
			trash: "Lahla",
			noVotes: "Akukho zivoti",
			stashPct: "{{pct}}% gcina",
			stashCount: "{{count}} gcina",
			trashCount: "{{count}} lahla",
			signInPrompt: "Ngena ukuze unike isigwebo sakho.",
			by: "ngu-{{name}}",
			deletePost: "Cima iposti",
			deleted: "Kucinyiwe.",
			voteFailed: "Ukuvota kusilele.",
			deleteFailed: "Ukucima kusilele."
		},
		submit: {
			trigger: "Thumela",
			title: "Thumela into egwetywayo",
			intro: "Phawula umqondiso, yongeza umfanekiso, uvumele uluntu lugqibe: gcina okanye lahla.",
			fieldTitle: "Isihloko",
			titlePh: "Ezi zihlangu ze-neon…",
			brand: "Uphawu (akunyanzelekanga)",
			brandPh: "Khetha uphawu",
			noBrand: "Akukho phawu",
			category: "Udidi (akunyanzelekanga)",
			categoryPh: "Upakisho, intengiso, imveliso, inkonzo…",
			description: "Inkcazo (akunyanzelekanga)",
			descriptionPh: "Kutheni kufuneka kugcinwe okanye kulahlwe?",
			photo: "Ifoto (akunyanzelekanga)",
			posting: "Iyathumela…",
			submit: "Thumela",
			needTitle: "Nika isihloko kuqala.",
			posted: "Kuthunyelwe! Masiqale isigwebo.",
			error: "Kukho into engahambanga kakuhle."
		},
		auth: {
			continueGoogle: "Qhubeka nge-Google",
			or: "okanye",
			signIn: "Ngena",
			signUp: "Bhalisa",
			email: "I-imeyile",
			password: "Iphaswedi",
			displayName: "Igama eliboniswayo",
			createAccount: "Yenza iakhawunti",
			welcome: "Wamkelekile kwakhona!",
			created: "Iakhawunti yenziwe!",
			googleFailed: "Ukungena nge-Google kusilele."
		},
		brand: {
			title: "Iimpawu",
			subtitle: "Iimpawu eziqinisekisiweyo nesigwebo soluntu esibukhoma.",
			create: "Yenza uphawu",
			verified: "Iqinisekisiwe",
			trustScore: "Amanqaku okuthembeka",
			requestVerification: "Cela uqinisekiso",
			verificationPending: "Uqinisekiso lulindile",
			message: "Thumela umyalezo kumnini",
			posts: "Iiposti ngolu phawu",
			noBrands: "Akukho zimpawu. Yongeza eyokuqala.",
			website: "Iwebhusayithi",
			by: "Ilawulwa ngu"
		},
		dashboard: {
			title: "Ideshbhodi yophawu",
			subtitle: "Lawula iimpawu ozimeleyo ulandele imvakalelo yoluntu.",
			noBrands: "Awukalawuli mpawu okwangoku.",
			createFirst: "Yenza uphawu lwakho lokuqala",
			newBrand: "Uphawu olutsha",
			trustScore: "Amanqaku okuthembeka",
			posts: "Iiposti",
			stash: "Gcina",
			trash: "Lahla",
			verified: "Iqinisekisiwe",
			unverified: "Ayiqinisekiswanga",
			requestVerification: "Cela uqinisekiso",
			view: "Jonga iphepha",
			manage: "Lawula"
		},
		awards: {
			title: "Amabhaso e-SOT",
			tagline: "Isigwebo sabantu, sisemthethweni.",
			intro: "Minyaka le, iimpawu ezithenjwa kakhulu ehlabathini zithweswa amabhaso e-SOT — zigqitywa zizigwebo zokwenene zabantu bokwenene.",
			leaderboard: "Uludwe lwabaphambili",
			leaderboardNote: "Izikhundla zangoku ezimisa amabhaso alo nyaka.",
			rank: "Isikhundla",
			brand: "Uphawu",
			score: "Amanqaku okuthembeka",
			categoryTitle: "Iindidi zamabhaso",
			cat1: "Uphawu oluthenjwa kakhulu",
			cat1d: "Amanqaku aphezulu okuthembeka onyakeni.",
			cat2: "Igorha labantu",
			cat2d: "Izigwebo ezininzi zokuGcina.",
			cat3: "Utshintsho olukhulu",
			cat3d: "Ukunyuka okukhulu kwiinyanga ezili-12.",
			cat4: "Inkwenkwezi ekhulayo",
			cat4d: "Uphawu olutsha olugqwesileyo.",
			cta: "Mela uphawu lwakho",
			ctaNote: "Unophawu? Thatha iphepha lakho unyuke."
		},
		messages: {
			title: "Imiyalezo",
			empty: "Akukho miyalezo.",
			placeholder: "Bhala umyalezo…",
			send: "Thumela",
			to: "Ku"
		},
		admin: {
			title: "Umgca woqinisekiso",
			empty: "Akukho zicelo zilindileyo.",
			approve: "Yamkela",
			reject: "Yala",
			approved: "Yamkelwe",
			rejected: "Yaliwe"
		},
		common: {
			cancel: "Rhoxisa",
			save: "Gcina",
			loading: "Iyalayisha…"
		}
	},
	st: {
		nav: {
			feed: "Phepha",
			brands: "Diteko",
			messages: "Melaetsa",
			admin: "Molaodi",
			dashboard: "Laeboto",
			awards: "Dikgau",
			post: "Phatlalatsa",
			signIn: "Kena",
			signOut: "Tswa",
			profile: "Boemo"
		},
		home: {
			subtitle: "Sekgahla sa diteko. Phatlalatsa eng kapa eng ka teko mme o lumelle setjhaba se fane ka kahlolo hang-hang.",
			hook: "Kahlolo e nngwe le e nngwe e atametsa diteko ho batho. Fana ka ya hao. 🔥",
			emptyTitle: "Ha ho letho la ho ahlola hajwale",
			emptyBodyUser: "Eba wa pele — tobetsa Phatlalatsa.",
			emptyBodyGuest: "Eba wa pele — kena mme o phatlalatse."
		},
		engagement: {
			streak: "Letoto la matsatsi a {{count}}",
			today: "{{count}} kajeno",
			total: "{{count}} kakaretso",
			next: "Dikahlolo tse ding tse {{count}} ho fihlela betjhe e latelang",
			topCritic: "O mohlahlobi ya hodimo — diteko di a mamela. 👑"
		},
		vote: {
			stash: "Boloka",
			trash: "Lahla",
			noVotes: "Ha ho divoutu",
			stashPct: "{{pct}}% boloka",
			stashCount: "{{count}} boloka",
			trashCount: "{{count}} lahla",
			signInPrompt: "Kena ho fana ka kahlolo ya hao.",
			by: "ka {{name}}",
			deletePost: "Hlakola poso",
			deleted: "E hlakotswe.",
			voteFailed: "Ho vouta ho hlolehile.",
			deleteFailed: "Ho hlakola ho hlolehile."
		},
		submit: {
			trigger: "Phatlalatsa",
			title: "Phatlalatsa ho hong ho ahlolwang",
			intro: "Tshwaya teko, kenya setshwantsho, mme o lumelle setjhaba se etse qeto: boloka kapa lahla.",
			fieldTitle: "Sehlooho",
			titlePh: "Dieta tsena tsa neon…",
			brand: "Teko (boikgethelo)",
			brandPh: "Kgetha teko",
			noBrand: "Ha ho teko",
			category: "Sehlopha (boikgethelo)",
			categoryPh: "Ho paka, papatso, sehlahiswa, tshebeletso…",
			description: "Tlhaloso (boikgethelo)",
			descriptionPh: "Hobaneng ho lokela ho bolokwa kapa ho lahlwa?",
			photo: "Setshwantsho (boikgethelo)",
			posting: "E a phatlalatswa…",
			submit: "Phatlalatsa",
			needTitle: "Fana ka sehlooho pele.",
			posted: "E phatlalditswe! Kahlolo e qale.",
			error: "Ho na le se sa tsamayang hantle."
		},
		auth: {
			continueGoogle: "Tswela pele ka Google",
			or: "kapa",
			signIn: "Kena",
			signUp: "Ngodisa",
			email: "Imeile",
			password: "Phasewete",
			displayName: "Lebitso le bontshwang",
			createAccount: "Theha akhaonto",
			welcome: "Rea o amohela hape!",
			created: "Akhaonto e thehilwe!",
			googleFailed: "Ho kena ka Google ho hlolehile."
		},
		brand: {
			title: "Diteko",
			subtitle: "Diteko tse netefaditsweng le kahlolo ya setjhaba.",
			create: "Theha teko",
			verified: "E netefaditswe",
			trustScore: "Tekanyo ya tshepo",
			requestVerification: "Kopa netefatso",
			verificationPending: "Netefatso e emetse",
			message: "Romela molaetsa ho mong'a yona",
			posts: "Diposo tsa teko ena",
			noBrands: "Ha ho diteko. Eketsa ya pele.",
			website: "Websaete",
			by: "E tsamaiswa ke"
		},
		dashboard: {
			title: "Laeboto ya teko",
			subtitle: "Laola diteko tseo o di emelang mme o latele maikutlo a setjhaba.",
			noBrands: "Ha o so laole teko efe kapa efe.",
			createFirst: "Theha teko ya hao ya pele",
			newBrand: "Teko e ntjha",
			trustScore: "Tekanyo ya tshepo",
			posts: "Diposo",
			stash: "Boloka",
			trash: "Lahla",
			verified: "E netefaditswe",
			unverified: "Ha e a netefatswa",
			requestVerification: "Kopa netefatso",
			view: "Sheba leqephe",
			manage: "Laola"
		},
		awards: {
			title: "Dikgau tsa SOT",
			tagline: "Kahlolo ya batho, e entswe ya semmuso.",
			intro: "Selemo se seng le se seng, diteko tse tshepuwang ka ho fetisisa lefatsheng di hlwauwa Dikgauung tsa SOT — di kgethwa ke dikahlolo tsa nnete tsa batho ba nnete.",
			leaderboard: "Lethathamo la hajwale",
			leaderboardNote: "Maemo a hajwale a bopang dikgau tsa selemo sena.",
			rank: "Boemo",
			brand: "Teko",
			score: "Tekanyo ya tshepo",
			categoryTitle: "Dihlopha tsa dikgau",
			cat1: "Teko e tshepuwang haholo",
			cat1d: "Tekanyo e phahameng ka ho fetisisa selemong.",
			cat2: "Mohale wa batho",
			cat2d: "Dikahlolo tse ngata tsa ho Boloka.",
			cat3: "Phetoho e kgolo",
			cat3d: "Nyoloho e kgolo dikgweding tse 12.",
			cat4: "Naledi e hlahang",
			cat4d: "Teko e ntjha e molemo ka ho fetisisa.",
			cta: "Emela teko ya hao",
			ctaNote: "O na le teko? Nka leqephe la hao mme o nyolohe."
		},
		messages: {
			title: "Melaetsa",
			empty: "Ha ho melaetsa.",
			placeholder: "Ngola molaetsa…",
			send: "Romela",
			to: "Ho"
		},
		admin: {
			title: "Mola wa netefatso",
			empty: "Ha ho dikopo tse emetseng.",
			approve: "Amohela",
			reject: "Hana",
			approved: "E amohetswe",
			rejected: "E hanne"
		},
		common: {
			cancel: "Hlakola",
			save: "Boloka",
			loading: "E a laoda…"
		}
	},
	af: {
		nav: {
			feed: "Voer",
			brands: "Handelsmerke",
			messages: "Boodskappe",
			admin: "Admin",
			dashboard: "Kontroleskerm",
			awards: "Toekennings",
			post: "Plaas",
			signIn: "Meld aan",
			signOut: "Meld af",
			profile: "Profiel"
		},
		home: {
			subtitle: "Die handelsmerk-barometer. Plaas enigiets oor 'n handelsmerk en laat die gemeenskap sy oordeel lewend gee — die KX- en PR-sein wat saak maak.",
			hook: "Elke oordeel bring handelsmerke nader aan mense. Lewer joune. 🔥",
			emptyTitle: "Nog niks om te oordeel nie",
			emptyBodyUser: "Wees eerste — druk Plaas.",
			emptyBodyGuest: "Wees eerste — meld aan en plaas iets."
		},
		engagement: {
			streak: "{{count}}-dag reeks",
			today: "{{count}} vandag",
			total: "{{count}} totaal",
			next: "Nog {{count}} oordele tot jou volgende kenteken",
			topCritic: "Jy is 'n topkritikus — handelsmerke luister. 👑"
		},
		vote: {
			stash: "Hou",
			trash: "Gooi weg",
			noVotes: "Nog geen stemme",
			stashPct: "{{pct}}% hou",
			stashCount: "{{count}} hou",
			trashCount: "{{count}} gooi weg",
			signInPrompt: "Meld aan om jou oordeel te lewer.",
			by: "deur {{name}}",
			deletePost: "Verwyder plasing",
			deleted: "Verwyder.",
			voteFailed: "Stem het misluk.",
			deleteFailed: "Verwydering het misluk."
		},
		submit: {
			trigger: "Plaas",
			title: "Plaas iets om te oordeel",
			intro: "Merk 'n handelsmerk, voeg 'n foto by en laat die gemeenskap besluit: hou of gooi weg.",
			fieldTitle: "Titel",
			titlePh: "Hierdie neon-tekkies…",
			brand: "Handelsmerk (opsioneel)",
			brandPh: "Kies 'n handelsmerk",
			noBrand: "Geen handelsmerk",
			category: "Kategorie (opsioneel)",
			categoryPh: "Verpakking, advertensie, produk, diens…",
			description: "Beskrywing (opsioneel)",
			descriptionPh: "Hoekom hou of weggooi?",
			photo: "Foto (opsioneel)",
			posting: "Besig om te plaas…",
			submit: "Plaas dit",
			needTitle: "Gee dit eers 'n titel.",
			posted: "Geplaas! Laat die oordeel begin.",
			error: "Iets het verkeerd geloop."
		},
		auth: {
			continueGoogle: "Gaan voort met Google",
			or: "of",
			signIn: "Meld aan",
			signUp: "Registreer",
			email: "E-pos",
			password: "Wagwoord",
			displayName: "Vertoonnaam",
			createAccount: "Skep rekening",
			welcome: "Welkom terug!",
			created: "Rekening geskep!",
			googleFailed: "Google-aanmelding het misluk."
		},
		brand: {
			title: "Handelsmerke",
			subtitle: "Geverifieerde handelsmerke en die gemeenskap se lewendige oordeel.",
			create: "Skep handelsmerk",
			verified: "Geverifieer",
			trustScore: "Vertrouenstelling",
			requestVerification: "Versoek verifikasie",
			verificationPending: "Verifikasie hangende",
			message: "Boodskap eienaar",
			posts: "Plasings oor hierdie handelsmerk",
			noBrands: "Nog geen handelsmerke nie. Voeg die eerste by.",
			website: "Webwerf",
			by: "Bestuur deur"
		},
		dashboard: {
			title: "Handelsmerk-kontroleskerm",
			subtitle: "Bestuur die handelsmerke wat jy verteenwoordig en volg hul sentiment.",
			noBrands: "Jy bestuur nog geen handelsmerke nie.",
			createFirst: "Skep jou eerste handelsmerk",
			newBrand: "Nuwe handelsmerk",
			trustScore: "Vertrouenstelling",
			posts: "Plasings",
			stash: "Hou",
			trash: "Gooi weg",
			verified: "Geverifieer",
			unverified: "Ongeverifieer",
			requestVerification: "Versoek verifikasie",
			view: "Bekyk bladsy",
			manage: "Bestuur"
		},
		awards: {
			title: "Die SOT-toekennings",
			tagline: "Die mense se oordeel, amptelik gemaak.",
			intro: "Elke jaar word die wêreld se mees vertroude handelsmerke by die SOT-toekennings gekroon — bepaal deur regte oordele van regte mense.",
			leaderboard: "Lewendige ranglys",
			leaderboardNote: "Die huidige stand wat vanjaar se toekennings vorm.",
			rank: "Rang",
			brand: "Handelsmerk",
			score: "Vertrouenstelling",
			categoryTitle: "Kategorieë",
			cat1: "Mees vertroude handelsmerk",
			cat1d: "Hoogste vertrouenstelling van die jaar.",
			cat2: "Volkskampioen",
			cat2d: "Meeste Hou-oordele.",
			cat3: "Grootste ommekeer",
			cat3d: "Grootste styging oor 12 maande.",
			cat4: "Opkomende ster",
			cat4d: "Beste nuwe handelsmerk van die jaar.",
			cta: "Verteenwoordig jou handelsmerk",
			ctaNote: "Eie handelsmerk? Eis jou bladsy en klim die ranglys."
		},
		messages: {
			title: "Boodskappe",
			empty: "Nog geen boodskappe nie.",
			placeholder: "Skryf 'n boodskap…",
			send: "Stuur",
			to: "Aan"
		},
		admin: {
			title: "Verifikasie-tou",
			empty: "Geen hangende versoeke nie.",
			approve: "Keur goed",
			reject: "Verwerp",
			approved: "Goedgekeur",
			rejected: "Verwerp"
		},
		common: {
			cancel: "Kanselleer",
			save: "Stoor",
			loading: "Laai…"
		}
	}
};
var socialTranslations = {
	es: {
		comment: "Comentar",
		comments: "Comentarios",
		like: "Me gusta",
		repost: "Republicar",
		share: "Compartir",
		linkCopied: "¡Enlace copiado!",
		signInToLike: "Inicia sesión para dar me gusta.",
		signInToRepost: "Inicia sesión para republicar.",
		signInToComment: "Inicia sesión para unirte a la conversación.",
		addComment: "Añade un comentario…",
		commentPosted: "¡Comentario publicado!",
		commentDeleted: "Comentario eliminado.",
		commentError: "No se pudo publicar tu comentario.",
		likeError: "No se pudo actualizar el me gusta.",
		deleteError: "No se pudo eliminar el comentario.",
		delete: "Eliminar",
		noComments: "Aún no hay comentarios. ¡Sé el primero!",
		trending: "Tendencias",
		noTrending: "Aún no hay hashtags en tendencia.",
		postsCount: "{{count}} publicaciones",
		hashtagTitle: "#{{tag}}",
		hashtagCount: "{{count}} publicaciones con este hashtag",
		hashtagEmpty: "Aún no hay publicaciones con #{{tag}}.",
		trySomethingElse: "Prueba con una de estas:",
		notifications: "Notificaciones",
		notifAll: "Todas",
		notifLikes: "Me gusta",
		notifFollows: "Seguidores",
		notifComments: "Comentarios",
		notifEmpty: "Aún no hay notificaciones.",
		notifFollow: "{{name}} empezó a seguirte",
		notifLikePost: "A {{name}} le gustó tu publicación",
		notifLikeComment: "A {{name}} le gustó tu comentario",
		notifComment: "{{name}} comentó tu publicación",
		notifMention: "{{name}} te mencionó",
		notifRepost: "{{name}} republicó tu publicación",
		notifOther: "{{name}} interactuó contigo",
		follow: "Seguir",
		unfollow: "Dejar de seguir",
		followers: "{{count}} seguidores",
		following: "Siguiendo",
		signInToFollow: "Inicia sesión para seguir a personas.",
		trustScore: "Índice de confianza",
		profileTitle: "Perfil",
		profileNotFound: "No se encontró este perfil.",
		postNotFound: "No se encontró esta publicación.",
		postsBy: "Publicaciones de {{name}}",
		noPosts: "Aún no hay publicaciones.",
		backToFeed: "Volver al inicio",
		unavailable: "No disponible",
		loadFailed: "No pudimos cargar esta página. Inténtalo de nuevo."
	},
	fr: {
		comment: "Commenter",
		comments: "Commentaires",
		like: "J'aime",
		repost: "Repartager",
		share: "Partager",
		linkCopied: "Lien copié !",
		signInToLike: "Connectez-vous pour aimer.",
		signInToRepost: "Connectez-vous pour repartager.",
		signInToComment: "Connectez-vous pour participer.",
		addComment: "Ajouter un commentaire…",
		commentPosted: "Commentaire publié !",
		commentDeleted: "Commentaire supprimé.",
		commentError: "Impossible de publier votre commentaire.",
		likeError: "Impossible de mettre à jour le j'aime.",
		deleteError: "Impossible de supprimer le commentaire.",
		delete: "Supprimer",
		noComments: "Aucun commentaire. Soyez le premier !",
		trending: "Tendances",
		noTrending: "Aucun hashtag en tendance.",
		postsCount: "{{count}} publications",
		hashtagTitle: "#{{tag}}",
		hashtagCount: "{{count}} publications avec ce hashtag",
		hashtagEmpty: "Aucune publication avec #{{tag}}.",
		trySomethingElse: "Essayez plutôt :",
		notifications: "Notifications",
		notifAll: "Tout",
		notifLikes: "J'aime",
		notifFollows: "Abonnements",
		notifComments: "Commentaires",
		notifEmpty: "Aucune notification.",
		notifFollow: "{{name}} vous suit désormais",
		notifLikePost: "{{name}} a aimé votre publication",
		notifLikeComment: "{{name}} a aimé votre commentaire",
		notifComment: "{{name}} a commenté votre publication",
		notifMention: "{{name}} vous a mentionné",
		notifRepost: "{{name}} a repartagé votre publication",
		notifOther: "{{name}} a interagi avec vous",
		follow: "Suivre",
		unfollow: "Ne plus suivre",
		followers: "{{count}} abonnés",
		following: "Abonné",
		signInToFollow: "Connectez-vous pour suivre.",
		trustScore: "Score de confiance",
		profileTitle: "Profil",
		profileNotFound: "Profil introuvable.",
		postNotFound: "Publication introuvable.",
		postsBy: "Publications de {{name}}",
		noPosts: "Aucune publication.",
		backToFeed: "Retour au fil",
		unavailable: "Indisponible",
		loadFailed: "Impossible de charger cette page. Réessayez."
	},
	de: {
		comment: "Kommentieren",
		comments: "Kommentare",
		like: "Gefällt mir",
		repost: "Teilen",
		share: "Teilen",
		linkCopied: "Link kopiert!",
		signInToLike: "Melde dich an, um zu liken.",
		signInToRepost: "Melde dich an, um zu reposten.",
		signInToComment: "Melde dich an, um mitzureden.",
		addComment: "Kommentar hinzufügen…",
		commentPosted: "Kommentar gepostet!",
		commentDeleted: "Kommentar gelöscht.",
		commentError: "Kommentar konnte nicht gepostet werden.",
		likeError: "Like konnte nicht aktualisiert werden.",
		deleteError: "Kommentar konnte nicht gelöscht werden.",
		delete: "Löschen",
		noComments: "Noch keine Kommentare. Mach den Anfang!",
		trending: "Trends",
		noTrending: "Noch keine Trend-Hashtags.",
		postsCount: "{{count}} Beiträge",
		hashtagTitle: "#{{tag}}",
		hashtagCount: "{{count}} Beiträge mit diesem Hashtag",
		hashtagEmpty: "Noch keine Beiträge mit #{{tag}}.",
		trySomethingElse: "Probiere stattdessen:",
		notifications: "Benachrichtigungen",
		notifAll: "Alle",
		notifLikes: "Likes",
		notifFollows: "Follows",
		notifComments: "Kommentare",
		notifEmpty: "Noch keine Benachrichtigungen.",
		notifFollow: "{{name}} folgt dir jetzt",
		notifLikePost: "{{name}} gefällt dein Beitrag",
		notifLikeComment: "{{name}} gefällt dein Kommentar",
		notifComment: "{{name}} hat deinen Beitrag kommentiert",
		notifMention: "{{name}} hat dich erwähnt",
		notifRepost: "{{name}} hat deinen Beitrag gerepostet",
		notifOther: "{{name}} hat mit dir interagiert",
		follow: "Folgen",
		unfollow: "Entfolgen",
		followers: "{{count}} Follower",
		following: "Folgt",
		signInToFollow: "Melde dich an, um zu folgen.",
		trustScore: "Vertrauenswert",
		profileTitle: "Profil",
		profileNotFound: "Profil nicht gefunden.",
		postNotFound: "Beitrag nicht gefunden.",
		postsBy: "Beiträge von {{name}}",
		noPosts: "Noch keine Beiträge.",
		backToFeed: "Zurück zum Feed",
		unavailable: "Nicht verfügbar",
		loadFailed: "Diese Seite konnte nicht geladen werden. Bitte erneut versuchen."
	},
	pt: {
		comment: "Comentar",
		comments: "Comentários",
		like: "Curtir",
		repost: "Repostar",
		share: "Partilhar",
		linkCopied: "Link copiado!",
		signInToLike: "Entre para curtir.",
		signInToRepost: "Entre para repostar.",
		signInToComment: "Entre para participar da conversa.",
		addComment: "Adicionar um comentário…",
		commentPosted: "Comentário publicado!",
		commentDeleted: "Comentário eliminado.",
		commentError: "Não foi possível publicar o comentário.",
		likeError: "Não foi possível atualizar a curtida.",
		deleteError: "Não foi possível eliminar o comentário.",
		delete: "Eliminar",
		noComments: "Ainda sem comentários. Seja o primeiro!",
		trending: "Tendências",
		noTrending: "Ainda sem hashtags em alta.",
		postsCount: "{{count}} publicações",
		hashtagTitle: "#{{tag}}",
		hashtagCount: "{{count}} publicações com esta hashtag",
		hashtagEmpty: "Ainda não há publicações com #{{tag}}.",
		trySomethingElse: "Experimente uma destas:",
		notifications: "Notificações",
		notifAll: "Tudo",
		notifLikes: "Curtidas",
		notifFollows: "Seguidores",
		notifComments: "Comentários",
		notifEmpty: "Ainda sem notificações.",
		notifFollow: "{{name}} começou a seguir-te",
		notifLikePost: "{{name}} curtiu a tua publicação",
		notifLikeComment: "{{name}} curtiu o teu comentário",
		notifComment: "{{name}} comentou a tua publicação",
		notifMention: "{{name}} mencionou-te",
		notifRepost: "{{name}} repostou a tua publicação",
		notifOther: "{{name}} interagiu contigo",
		follow: "Seguir",
		unfollow: "Deixar de seguir",
		followers: "{{count}} seguidores",
		following: "A seguir",
		signInToFollow: "Entre para seguir pessoas.",
		trustScore: "Índice de confiança",
		profileTitle: "Perfil",
		profileNotFound: "Perfil não encontrado.",
		postNotFound: "Publicação não encontrada.",
		postsBy: "Publicações de {{name}}",
		noPosts: "Ainda sem publicações.",
		backToFeed: "Voltar ao feed",
		unavailable: "Indisponível",
		loadFailed: "Não foi possível carregar esta página. Tente novamente."
	},
	it: {
		comment: "Commenta",
		comments: "Commenti",
		like: "Mi piace",
		repost: "Ricondividi",
		share: "Condividi",
		linkCopied: "Link copiato!",
		signInToLike: "Accedi per mettere mi piace.",
		signInToRepost: "Accedi per ricondividere.",
		signInToComment: "Accedi per partecipare.",
		addComment: "Aggiungi un commento…",
		commentPosted: "Commento pubblicato!",
		commentDeleted: "Commento eliminato.",
		commentError: "Impossibile pubblicare il commento.",
		likeError: "Impossibile aggiornare il mi piace.",
		deleteError: "Impossibile eliminare il commento.",
		delete: "Elimina",
		noComments: "Nessun commento. Inizia tu!",
		trending: "Di tendenza",
		noTrending: "Nessun hashtag di tendenza.",
		postsCount: "{{count}} post",
		hashtagTitle: "#{{tag}}",
		hashtagCount: "{{count}} post con questo hashtag",
		hashtagEmpty: "Ancora nessun post con #{{tag}}.",
		trySomethingElse: "Prova con questi:",
		notifications: "Notifiche",
		notifAll: "Tutte",
		notifLikes: "Mi piace",
		notifFollows: "Follower",
		notifComments: "Commenti",
		notifEmpty: "Nessuna notifica.",
		notifFollow: "{{name}} ha iniziato a seguirti",
		notifLikePost: "A {{name}} piace il tuo post",
		notifLikeComment: "A {{name}} piace il tuo commento",
		notifComment: "{{name}} ha commentato il tuo post",
		notifMention: "{{name}} ti ha menzionato",
		notifRepost: "{{name}} ha ricondiviso il tuo post",
		notifOther: "{{name}} ha interagito con te",
		follow: "Segui",
		unfollow: "Non seguire più",
		followers: "{{count}} follower",
		following: "Segui già",
		signInToFollow: "Accedi per seguire.",
		trustScore: "Punteggio di fiducia",
		profileTitle: "Profilo",
		profileNotFound: "Profilo non trovato.",
		postNotFound: "Post non trovato.",
		postsBy: "Post di {{name}}",
		noPosts: "Nessun post.",
		backToFeed: "Torna al feed",
		unavailable: "Non disponibile",
		loadFailed: "Impossibile caricare la pagina. Riprova."
	},
	nl: {
		comment: "Reageren",
		comments: "Reacties",
		like: "Leuk",
		repost: "Delen",
		share: "Delen",
		linkCopied: "Link gekopieerd!",
		signInToLike: "Log in om te liken.",
		signInToRepost: "Log in om te reposten.",
		signInToComment: "Log in om mee te praten.",
		addComment: "Voeg een reactie toe…",
		commentPosted: "Reactie geplaatst!",
		commentDeleted: "Reactie verwijderd.",
		commentError: "Reactie kon niet worden geplaatst.",
		likeError: "Like kon niet worden bijgewerkt.",
		deleteError: "Reactie kon niet worden verwijderd.",
		delete: "Verwijderen",
		noComments: "Nog geen reacties. Wees de eerste!",
		trending: "Trending",
		noTrending: "Nog geen trending hashtags.",
		postsCount: "{{count}} posts",
		hashtagTitle: "#{{tag}}",
		hashtagCount: "{{count}} posts met deze hashtag",
		hashtagEmpty: "Nog geen posts met #{{tag}}.",
		trySomethingElse: "Probeer deze:",
		notifications: "Meldingen",
		notifAll: "Alles",
		notifLikes: "Likes",
		notifFollows: "Volgers",
		notifComments: "Reacties",
		notifEmpty: "Nog geen meldingen.",
		notifFollow: "{{name}} volgt je nu",
		notifLikePost: "{{name}} vindt je post leuk",
		notifLikeComment: "{{name}} vindt je reactie leuk",
		notifComment: "{{name}} reageerde op je post",
		notifMention: "{{name}} noemde je",
		notifRepost: "{{name}} heeft je post gerepost",
		notifOther: "{{name}} reageerde op jou",
		follow: "Volgen",
		unfollow: "Ontvolgen",
		followers: "{{count}} volgers",
		following: "Volgend",
		signInToFollow: "Log in om te volgen.",
		trustScore: "Vertrouwensscore",
		profileTitle: "Profiel",
		profileNotFound: "Profiel niet gevonden.",
		postNotFound: "Post niet gevonden.",
		postsBy: "Posts van {{name}}",
		noPosts: "Nog geen posts.",
		backToFeed: "Terug naar feed",
		unavailable: "Niet beschikbaar",
		loadFailed: "We konden deze pagina niet laden. Probeer opnieuw."
	},
	pl: {
		comment: "Skomentuj",
		comments: "Komentarze",
		like: "Polub",
		repost: "Podaj dalej",
		share: "Udostępnij",
		linkCopied: "Skopiowano link!",
		signInToLike: "Zaloguj się, aby polubić.",
		signInToRepost: "Zaloguj się, aby podać dalej.",
		signInToComment: "Zaloguj się, aby dołączyć do rozmowy.",
		addComment: "Dodaj komentarz…",
		commentPosted: "Komentarz dodany!",
		commentDeleted: "Komentarz usunięty.",
		commentError: "Nie udało się dodać komentarza.",
		likeError: "Nie udało się zaktualizować polubienia.",
		deleteError: "Nie udało się usunąć komentarza.",
		delete: "Usuń",
		noComments: "Brak komentarzy. Bądź pierwszy!",
		trending: "Na czasie",
		noTrending: "Brak popularnych hashtagów.",
		postsCount: "{{count}} postów",
		hashtagTitle: "#{{tag}}",
		hashtagCount: "{{count}} postów z tym hashtagiem",
		hashtagEmpty: "Brak postów z #{{tag}}.",
		trySomethingElse: "Spróbuj tych:",
		notifications: "Powiadomienia",
		notifAll: "Wszystkie",
		notifLikes: "Polubienia",
		notifFollows: "Obserwacje",
		notifComments: "Komentarze",
		notifEmpty: "Brak powiadomień.",
		notifFollow: "{{name}} zaczął(-ęła) Cię obserwować",
		notifLikePost: "{{name}} polubił(a) Twój post",
		notifLikeComment: "{{name}} polubił(a) Twój komentarz",
		notifComment: "{{name}} skomentował(a) Twój post",
		notifMention: "{{name}} wspomniał(a) o Tobie",
		notifRepost: "{{name}} podał(a) dalej Twój post",
		notifOther: "{{name}} wszedł(-eszła) z Tobą w interakcję",
		follow: "Obserwuj",
		unfollow: "Przestań obserwować",
		followers: "{{count}} obserwujących",
		following: "Obserwujesz",
		signInToFollow: "Zaloguj się, aby obserwować.",
		trustScore: "Wskaźnik zaufania",
		profileTitle: "Profil",
		profileNotFound: "Nie znaleziono profilu.",
		postNotFound: "Nie znaleziono posta.",
		postsBy: "Posty użytkownika {{name}}",
		noPosts: "Brak postów.",
		backToFeed: "Wróć do kanału",
		unavailable: "Niedostępne",
		loadFailed: "Nie udało się wczytać strony. Spróbuj ponownie."
	},
	ru: {
		comment: "Комментировать",
		comments: "Комментарии",
		like: "Нравится",
		repost: "Репост",
		share: "Поделиться",
		linkCopied: "Ссылка скопирована!",
		signInToLike: "Войдите, чтобы ставить лайки.",
		signInToRepost: "Войдите, чтобы сделать репост.",
		signInToComment: "Войдите, чтобы участвовать в обсуждении.",
		addComment: "Добавить комментарий…",
		commentPosted: "Комментарий опубликован!",
		commentDeleted: "Комментарий удалён.",
		commentError: "Не удалось опубликовать комментарий.",
		likeError: "Не удалось обновить лайк.",
		deleteError: "Не удалось удалить комментарий.",
		delete: "Удалить",
		noComments: "Комментариев пока нет. Будьте первым!",
		trending: "В тренде",
		noTrending: "Пока нет популярных хэштегов.",
		postsCount: "{{count}} публикаций",
		hashtagTitle: "#{{tag}}",
		hashtagCount: "{{count}} публикаций с этим хэштегом",
		hashtagEmpty: "Пока нет публикаций с #{{tag}}.",
		trySomethingElse: "Попробуйте эти:",
		notifications: "Уведомления",
		notifAll: "Все",
		notifLikes: "Лайки",
		notifFollows: "Подписки",
		notifComments: "Комментарии",
		notifEmpty: "Уведомлений пока нет.",
		notifFollow: "{{name}} подписался(-ась) на вас",
		notifLikePost: "{{name}} оценил(а) вашу публикацию",
		notifLikeComment: "{{name}} оценил(а) ваш комментарий",
		notifComment: "{{name}} прокомментировал(а) вашу публикацию",
		notifMention: "{{name}} упомянул(а) вас",
		notifRepost: "{{name}} сделал(а) репост вашей публикации",
		notifOther: "{{name}} взаимодействовал(а) с вами",
		follow: "Подписаться",
		unfollow: "Отписаться",
		followers: "{{count}} подписчиков",
		following: "Вы подписаны",
		signInToFollow: "Войдите, чтобы подписываться.",
		trustScore: "Индекс доверия",
		profileTitle: "Профиль",
		profileNotFound: "Профиль не найден.",
		postNotFound: "Публикация не найдена.",
		postsBy: "Публикации {{name}}",
		noPosts: "Публикаций пока нет.",
		backToFeed: "Назад в ленту",
		unavailable: "Недоступно",
		loadFailed: "Не удалось загрузить страницу. Попробуйте снова."
	},
	tr: {
		comment: "Yorum yap",
		comments: "Yorumlar",
		like: "Beğen",
		repost: "Yeniden paylaş",
		share: "Paylaş",
		linkCopied: "Bağlantı kopyalandı!",
		signInToLike: "Beğenmek için giriş yapın.",
		signInToRepost: "Yeniden paylaşmak için giriş yapın.",
		signInToComment: "Sohbete katılmak için giriş yapın.",
		addComment: "Yorum ekle…",
		commentPosted: "Yorum paylaşıldı!",
		commentDeleted: "Yorum silindi.",
		commentError: "Yorum paylaşılamadı.",
		likeError: "Beğeni güncellenemedi.",
		deleteError: "Yorum silinemedi.",
		delete: "Sil",
		noComments: "Henüz yorum yok. İlk sen ol!",
		trending: "Gündem",
		noTrending: "Henüz gündemde hashtag yok.",
		postsCount: "{{count}} gönderi",
		hashtagTitle: "#{{tag}}",
		hashtagCount: "Bu hashtag ile {{count}} gönderi",
		hashtagEmpty: "#{{tag}} ile henüz gönderi yok.",
		trySomethingElse: "Bunları deneyin:",
		notifications: "Bildirimler",
		notifAll: "Tümü",
		notifLikes: "Beğeniler",
		notifFollows: "Takipler",
		notifComments: "Yorumlar",
		notifEmpty: "Henüz bildirim yok.",
		notifFollow: "{{name}} seni takip etmeye başladı",
		notifLikePost: "{{name}} gönderini beğendi",
		notifLikeComment: "{{name}} yorumunu beğendi",
		notifComment: "{{name}} gönderine yorum yaptı",
		notifMention: "{{name}} senden bahsetti",
		notifRepost: "{{name}} gönderini yeniden paylaştı",
		notifOther: "{{name}} seninle etkileşime geçti",
		follow: "Takip et",
		unfollow: "Takibi bırak",
		followers: "{{count}} takipçi",
		following: "Takip ediliyor",
		signInToFollow: "Takip etmek için giriş yapın.",
		trustScore: "Güven puanı",
		profileTitle: "Profil",
		profileNotFound: "Profil bulunamadı.",
		postNotFound: "Gönderi bulunamadı.",
		postsBy: "{{name}} gönderileri",
		noPosts: "Henüz gönderi yok.",
		backToFeed: "Akışa dön",
		unavailable: "Kullanılamıyor",
		loadFailed: "Bu sayfa yüklenemedi. Lütfen tekrar deneyin."
	},
	ar: {
		comment: "تعليق",
		comments: "التعليقات",
		like: "إعجاب",
		repost: "إعادة نشر",
		share: "مشاركة",
		linkCopied: "تم نسخ الرابط!",
		signInToLike: "سجّل الدخول للإعجاب.",
		signInToRepost: "سجّل الدخول لإعادة النشر.",
		signInToComment: "سجّل الدخول للمشاركة في النقاش.",
		addComment: "أضف تعليقًا…",
		commentPosted: "تم نشر التعليق!",
		commentDeleted: "تم حذف التعليق.",
		commentError: "تعذّر نشر تعليقك.",
		likeError: "تعذّر تحديث الإعجاب.",
		deleteError: "تعذّر حذف التعليق.",
		delete: "حذف",
		noComments: "لا توجد تعليقات بعد. كن الأول!",
		trending: "الأكثر رواجًا",
		noTrending: "لا توجد وسوم رائجة بعد.",
		postsCount: "{{count}} منشور",
		hashtagTitle: "#{{tag}}",
		hashtagCount: "{{count}} منشور بهذا الوسم",
		hashtagEmpty: "لا توجد منشورات بـ #{{tag}} بعد.",
		trySomethingElse: "جرّب هذه بدلاً منها:",
		notifications: "الإشعارات",
		notifAll: "الكل",
		notifLikes: "الإعجابات",
		notifFollows: "المتابعات",
		notifComments: "التعليقات",
		notifEmpty: "لا توجد إشعارات بعد.",
		notifFollow: "{{name}} بدأ بمتابعتك",
		notifLikePost: "{{name}} أعجب بمنشورك",
		notifLikeComment: "{{name}} أعجب بتعليقك",
		notifComment: "{{name}} علّق على منشورك",
		notifMention: "{{name}} أشار إليك",
		notifRepost: "{{name}} أعاد نشر منشورك",
		notifOther: "{{name}} تفاعل معك",
		follow: "متابعة",
		unfollow: "إلغاء المتابعة",
		followers: "{{count}} متابع",
		following: "تتابعه",
		signInToFollow: "سجّل الدخول للمتابعة.",
		trustScore: "مؤشر الثقة",
		profileTitle: "الملف الشخصي",
		profileNotFound: "لم يتم العثور على هذا الملف.",
		postNotFound: "لم يتم العثور على هذا المنشور.",
		postsBy: "منشورات {{name}}",
		noPosts: "لا توجد منشورات بعد.",
		backToFeed: "العودة إلى الصفحة الرئيسية",
		unavailable: "غير متاح",
		loadFailed: "تعذّر تحميل هذه الصفحة. حاول مرة أخرى."
	},
	hi: {
		comment: "टिप्पणी करें",
		comments: "टिप्पणियाँ",
		like: "पसंद",
		repost: "रीपोस्ट",
		share: "साझा करें",
		linkCopied: "लिंक कॉपी हो गया!",
		signInToLike: "पसंद करने के लिए साइन इन करें.",
		signInToRepost: "रीपोस्ट के लिए साइन इन करें.",
		signInToComment: "बातचीत में शामिल होने के लिए साइन इन करें.",
		addComment: "टिप्पणी जोड़ें…",
		commentPosted: "टिप्पणी पोस्ट हुई!",
		commentDeleted: "टिप्पणी हटाई गई.",
		commentError: "टिप्पणी पोस्ट नहीं हो सकी.",
		likeError: "पसंद अपडेट नहीं हो सकी.",
		deleteError: "टिप्पणी हटाई नहीं जा सकी.",
		delete: "हटाएँ",
		noComments: "अभी कोई टिप्पणी नहीं. पहले आप करें!",
		trending: "ट्रेंडिंग",
		noTrending: "अभी कोई ट्रेंडिंग हैशटैग नहीं.",
		postsCount: "{{count}} पोस्ट",
		hashtagTitle: "#{{tag}}",
		hashtagCount: "इस हैशटैग के साथ {{count}} पोस्ट",
		hashtagEmpty: "#{{tag}} के साथ अभी कोई पोस्ट नहीं.",
		trySomethingElse: "इनमें से कोई आज़माएँ:",
		notifications: "सूचनाएँ",
		notifAll: "सभी",
		notifLikes: "पसंद",
		notifFollows: "फ़ॉलो",
		notifComments: "टिप्पणियाँ",
		notifEmpty: "अभी कोई सूचना नहीं.",
		notifFollow: "{{name}} ने आपको फ़ॉलो किया",
		notifLikePost: "{{name}} ने आपकी पोस्ट पसंद की",
		notifLikeComment: "{{name}} ने आपकी टिप्पणी पसंद की",
		notifComment: "{{name}} ने आपकी पोस्ट पर टिप्पणी की",
		notifMention: "{{name}} ने आपका उल्लेख किया",
		notifRepost: "{{name}} ने आपकी पोस्ट रीपोस्ट की",
		notifOther: "{{name}} ने आपसे संपर्क किया",
		follow: "फ़ॉलो करें",
		unfollow: "अनफ़ॉलो",
		followers: "{{count}} फ़ॉलोअर",
		following: "फ़ॉलो कर रहे हैं",
		signInToFollow: "फ़ॉलो करने के लिए साइन इन करें.",
		trustScore: "ट्रस्ट स्कोर",
		profileTitle: "प्रोफ़ाइल",
		profileNotFound: "यह प्रोफ़ाइल नहीं मिली.",
		postNotFound: "यह पोस्ट नहीं मिली.",
		postsBy: "{{name}} की पोस्ट",
		noPosts: "अभी कोई पोस्ट नहीं.",
		backToFeed: "फ़ीड पर वापस",
		unavailable: "अनुपलब्ध",
		loadFailed: "यह पेज लोड नहीं हो सका. फिर कोशिश करें."
	},
	zh: {
		comment: "评论",
		comments: "评论",
		like: "点赞",
		repost: "转发",
		share: "分享",
		linkCopied: "链接已复制！",
		signInToLike: "登录后即可点赞。",
		signInToRepost: "登录后即可转发。",
		signInToComment: "登录后参与讨论。",
		addComment: "写评论…",
		commentPosted: "评论已发布！",
		commentDeleted: "评论已删除。",
		commentError: "无法发布评论。",
		likeError: "无法更新点赞。",
		deleteError: "无法删除评论。",
		delete: "删除",
		noComments: "还没有评论，抢先评论吧！",
		trending: "热门",
		noTrending: "暂无热门话题。",
		postsCount: "{{count}} 条帖子",
		hashtagTitle: "#{{tag}}",
		hashtagCount: "{{count}} 条帖子使用了该话题",
		hashtagEmpty: "还没有 #{{tag}} 的帖子。",
		trySomethingElse: "试试这些：",
		notifications: "通知",
		notifAll: "全部",
		notifLikes: "点赞",
		notifFollows: "关注",
		notifComments: "评论",
		notifEmpty: "暂无通知。",
		notifFollow: "{{name}} 关注了你",
		notifLikePost: "{{name}} 赞了你的帖子",
		notifLikeComment: "{{name}} 赞了你的评论",
		notifComment: "{{name}} 评论了你的帖子",
		notifMention: "{{name}} 提到了你",
		notifRepost: "{{name}} 转发了你的帖子",
		notifOther: "{{name}} 与你互动",
		follow: "关注",
		unfollow: "取消关注",
		followers: "{{count}} 位关注者",
		following: "已关注",
		signInToFollow: "登录后即可关注。",
		trustScore: "信任分",
		profileTitle: "个人主页",
		profileNotFound: "找不到该用户。",
		postNotFound: "找不到该帖子。",
		postsBy: "{{name}} 的帖子",
		noPosts: "暂无帖子。",
		backToFeed: "返回首页",
		unavailable: "不可用",
		loadFailed: "无法加载此页面，请重试。"
	},
	ja: {
		comment: "コメント",
		comments: "コメント",
		like: "いいね",
		repost: "リポスト",
		share: "共有",
		linkCopied: "リンクをコピーしました！",
		signInToLike: "いいねするにはサインインしてください。",
		signInToRepost: "リポストするにはサインインしてください。",
		signInToComment: "会話に参加するにはサインインしてください。",
		addComment: "コメントを追加…",
		commentPosted: "コメントを投稿しました！",
		commentDeleted: "コメントを削除しました。",
		commentError: "コメントを投稿できませんでした。",
		likeError: "いいねを更新できませんでした。",
		deleteError: "コメントを削除できませんでした。",
		delete: "削除",
		noComments: "まだコメントはありません。最初の一人になりましょう！",
		trending: "トレンド",
		noTrending: "トレンドのハッシュタグはまだありません。",
		postsCount: "{{count}} 件の投稿",
		hashtagTitle: "#{{tag}}",
		hashtagCount: "このハッシュタグの投稿 {{count}} 件",
		hashtagEmpty: "#{{tag}} の投稿はまだありません。",
		trySomethingElse: "こちらもどうぞ：",
		notifications: "通知",
		notifAll: "すべて",
		notifLikes: "いいね",
		notifFollows: "フォロー",
		notifComments: "コメント",
		notifEmpty: "通知はまだありません。",
		notifFollow: "{{name}} さんがあなたをフォローしました",
		notifLikePost: "{{name}} さんがあなたの投稿にいいねしました",
		notifLikeComment: "{{name}} さんがあなたのコメントにいいねしました",
		notifComment: "{{name}} さんがあなたの投稿にコメントしました",
		notifMention: "{{name}} さんがあなたに言及しました",
		notifRepost: "{{name}} さんがあなたの投稿をリポストしました",
		notifOther: "{{name}} さんが反応しました",
		follow: "フォロー",
		unfollow: "フォロー解除",
		followers: "フォロワー {{count}} 人",
		following: "フォロー中",
		signInToFollow: "フォローするにはサインインしてください。",
		trustScore: "信頼スコア",
		profileTitle: "プロフィール",
		profileNotFound: "プロフィールが見つかりません。",
		postNotFound: "投稿が見つかりません。",
		postsBy: "{{name}} さんの投稿",
		noPosts: "投稿はまだありません。",
		backToFeed: "フィードに戻る",
		unavailable: "利用できません",
		loadFailed: "ページを読み込めませんでした。もう一度お試しください。"
	},
	ko: {
		comment: "댓글",
		comments: "댓글",
		like: "좋아요",
		repost: "리포스트",
		share: "공유",
		linkCopied: "링크를 복사했습니다!",
		signInToLike: "좋아요하려면 로그인하세요.",
		signInToRepost: "리포스트하려면 로그인하세요.",
		signInToComment: "대화에 참여하려면 로그인하세요.",
		addComment: "댓글 달기…",
		commentPosted: "댓글을 남겼습니다!",
		commentDeleted: "댓글을 삭제했습니다.",
		commentError: "댓글을 등록하지 못했습니다.",
		likeError: "좋아요를 업데이트하지 못했습니다.",
		deleteError: "댓글을 삭제하지 못했습니다.",
		delete: "삭제",
		noComments: "아직 댓글이 없습니다. 첫 댓글을 남겨보세요!",
		trending: "인기",
		noTrending: "아직 인기 해시태그가 없습니다.",
		postsCount: "게시물 {{count}}개",
		hashtagTitle: "#{{tag}}",
		hashtagCount: "이 해시태그의 게시물 {{count}}개",
		hashtagEmpty: "#{{tag}} 게시물이 아직 없습니다.",
		trySomethingElse: "이건 어떠세요:",
		notifications: "알림",
		notifAll: "전체",
		notifLikes: "좋아요",
		notifFollows: "팔로우",
		notifComments: "댓글",
		notifEmpty: "아직 알림이 없습니다.",
		notifFollow: "{{name}}님이 회원님을 팔로우했습니다",
		notifLikePost: "{{name}}님이 회원님의 게시물을 좋아합니다",
		notifLikeComment: "{{name}}님이 회원님의 댓글을 좋아합니다",
		notifComment: "{{name}}님이 회원님의 게시물에 댓글을 남겼습니다",
		notifMention: "{{name}}님이 회원님을 언급했습니다",
		notifRepost: "{{name}}님이 회원님의 게시물을 리포스트했습니다",
		notifOther: "{{name}}님이 반응했습니다",
		follow: "팔로우",
		unfollow: "언팔로우",
		followers: "팔로워 {{count}}명",
		following: "팔로잉",
		signInToFollow: "팔로우하려면 로그인하세요.",
		trustScore: "신뢰 점수",
		profileTitle: "프로필",
		profileNotFound: "프로필을 찾을 수 없습니다.",
		postNotFound: "게시물을 찾을 수 없습니다.",
		postsBy: "{{name}}님의 게시물",
		noPosts: "게시물이 없습니다.",
		backToFeed: "피드로 돌아가기",
		unavailable: "사용할 수 없음",
		loadFailed: "페이지를 불러오지 못했습니다. 다시 시도해 주세요."
	},
	id: {
		comment: "Komentar",
		comments: "Komentar",
		like: "Suka",
		repost: "Posting ulang",
		share: "Bagikan",
		linkCopied: "Tautan disalin!",
		signInToLike: "Masuk untuk menyukai.",
		signInToRepost: "Masuk untuk memposting ulang.",
		signInToComment: "Masuk untuk ikut berdiskusi.",
		addComment: "Tambahkan komentar…",
		commentPosted: "Komentar terkirim!",
		commentDeleted: "Komentar dihapus.",
		commentError: "Komentar gagal dikirim.",
		likeError: "Gagal memperbarui suka.",
		deleteError: "Gagal menghapus komentar.",
		delete: "Hapus",
		noComments: "Belum ada komentar. Jadilah yang pertama!",
		trending: "Sedang tren",
		noTrending: "Belum ada tagar yang tren.",
		postsCount: "{{count}} postingan",
		hashtagTitle: "#{{tag}}",
		hashtagCount: "{{count}} postingan dengan tagar ini",
		hashtagEmpty: "Belum ada postingan dengan #{{tag}}.",
		trySomethingElse: "Coba yang ini:",
		notifications: "Notifikasi",
		notifAll: "Semua",
		notifLikes: "Suka",
		notifFollows: "Pengikut",
		notifComments: "Komentar",
		notifEmpty: "Belum ada notifikasi.",
		notifFollow: "{{name}} mulai mengikutimu",
		notifLikePost: "{{name}} menyukai postinganmu",
		notifLikeComment: "{{name}} menyukai komentarmu",
		notifComment: "{{name}} mengomentari postinganmu",
		notifMention: "{{name}} menyebutmu",
		notifRepost: "{{name}} memposting ulang postinganmu",
		notifOther: "{{name}} berinteraksi denganmu",
		follow: "Ikuti",
		unfollow: "Berhenti mengikuti",
		followers: "{{count}} pengikut",
		following: "Mengikuti",
		signInToFollow: "Masuk untuk mengikuti.",
		trustScore: "Skor kepercayaan",
		profileTitle: "Profil",
		profileNotFound: "Profil tidak ditemukan.",
		postNotFound: "Postingan tidak ditemukan.",
		postsBy: "Postingan {{name}}",
		noPosts: "Belum ada postingan.",
		backToFeed: "Kembali ke beranda",
		unavailable: "Tidak tersedia",
		loadFailed: "Halaman gagal dimuat. Coba lagi."
	},
	sw: {
		comment: "Toa maoni",
		comments: "Maoni",
		like: "Penda",
		repost: "Sambaza",
		share: "Shiriki",
		linkCopied: "Kiungo kimenakiliwa!",
		signInToLike: "Ingia ili kupenda.",
		signInToRepost: "Ingia ili kusambaza.",
		signInToComment: "Ingia ili kushiriki mazungumzo.",
		addComment: "Ongeza maoni…",
		commentPosted: "Maoni yamechapishwa!",
		commentDeleted: "Maoni yamefutwa.",
		commentError: "Imeshindwa kuchapisha maoni.",
		likeError: "Imeshindwa kusasisha kupenda.",
		deleteError: "Imeshindwa kufuta maoni.",
		delete: "Futa",
		noComments: "Hakuna maoni bado. Kuwa wa kwanza!",
		trending: "Zinazovuma",
		noTrending: "Hakuna lebo zinazovuma bado.",
		postsCount: "machapisho {{count}}",
		hashtagTitle: "#{{tag}}",
		hashtagCount: "machapisho {{count}} yenye lebo hii",
		hashtagEmpty: "Hakuna machapisho ya #{{tag}} bado.",
		trySomethingElse: "Jaribu haya:",
		notifications: "Arifa",
		notifAll: "Zote",
		notifLikes: "Kupenda",
		notifFollows: "Wafuasi",
		notifComments: "Maoni",
		notifEmpty: "Hakuna arifa bado.",
		notifFollow: "{{name}} amekufuata",
		notifLikePost: "{{name}} amependa chapisho lako",
		notifLikeComment: "{{name}} amependa maoni yako",
		notifComment: "{{name}} ametoa maoni kwenye chapisho lako",
		notifMention: "{{name}} amekutaja",
		notifRepost: "{{name}} amesambaza chapisho lako",
		notifOther: "{{name}} ameingiliana nawe",
		follow: "Fuata",
		unfollow: "Acha kufuata",
		followers: "wafuasi {{count}}",
		following: "Unamfuata",
		signInToFollow: "Ingia ili kufuata.",
		trustScore: "Alama ya kuaminika",
		profileTitle: "Wasifu",
		profileNotFound: "Wasifu haukupatikana.",
		postNotFound: "Chapisho halikupatikana.",
		postsBy: "Machapisho ya {{name}}",
		noPosts: "Hakuna machapisho bado.",
		backToFeed: "Rudi kwenye mlisho",
		unavailable: "Haipatikani",
		loadFailed: "Ukurasa haukuweza kupakiwa. Jaribu tena."
	},
	zu: {
		comment: "Phawula",
		comments: "Ukuphawula",
		like: "Thanda",
		repost: "Thumela futhi",
		share: "Yabelana",
		linkCopied: "Isixhumanisi sikopishiwe!",
		signInToLike: "Ngena ukuze uthande.",
		signInToRepost: "Ngena ukuze uthumele futhi.",
		signInToComment: "Ngena ukuze ujoyine ingxoxo.",
		addComment: "Engeza ukuphawula…",
		commentPosted: "Ukuphawula kuthunyelwe!",
		commentDeleted: "Ukuphawula kususiwe.",
		commentError: "Ayikwazanga ukuthumela ukuphawula.",
		likeError: "Ayikwazanga ukubuyekeza ukuthanda.",
		deleteError: "Ayikwazanga ukususa ukuphawula.",
		delete: "Susa",
		noComments: "Awukho ukuphawula okwamanje. Yiba ngowokuqala!",
		trending: "Okushisayo",
		noTrending: "Awekho ama-hashtag ashisayo okwamanje.",
		postsCount: "okuthunyelwe okungu-{{count}}",
		hashtagTitle: "#{{tag}}",
		hashtagCount: "okuthunyelwe okungu-{{count}} okune-hashtag",
		hashtagEmpty: "Akukho okuthunyelwe nge-#{{tag}} okwamanje.",
		trySomethingElse: "Zama lokhu:",
		notifications: "Izaziso",
		notifAll: "Konke",
		notifLikes: "Ukuthanda",
		notifFollows: "Ukulandela",
		notifComments: "Ukuphawula",
		notifEmpty: "Azikho izaziso okwamanje.",
		notifFollow: "{{name}} uqale ukukulandela",
		notifLikePost: "{{name}} uthande okuthunyelwe kwakho",
		notifLikeComment: "{{name}} uthande ukuphawula kwakho",
		notifComment: "{{name}} uphawule kokuthunyelwe kwakho",
		notifMention: "{{name}} ukubalile",
		notifRepost: "{{name}} uthumele futhi okuthunyelwe kwakho",
		notifOther: "{{name}} uxhumene nawe",
		follow: "Landela",
		unfollow: "Yeka ukulandela",
		followers: "abalandeli abangu-{{count}}",
		following: "Uyalandela",
		signInToFollow: "Ngena ukuze ulandele.",
		trustScore: "Amaphuzu okwethenjwa",
		profileTitle: "Iphrofayela",
		profileNotFound: "Le phrofayela ayitholakalanga.",
		postNotFound: "Lokhu okuthunyelwe akutholakalanga.",
		postsBy: "Okuthunyelwe ngu-{{name}}",
		noPosts: "Akukho okuthunyelwe okwamanje.",
		backToFeed: "Buyela ekhasini",
		unavailable: "Akutholakali",
		loadFailed: "Asikwazanga ukulayisha leli khasi. Zama futhi."
	},
	xh: {
		comment: "Gqabaza",
		comments: "Izimvo",
		like: "Thanda",
		repost: "Thumela kwakhona",
		share: "Yabelana",
		linkCopied: "Ikhonkco likhutshelwe!",
		signInToLike: "Ngena ukuze uthande.",
		signInToRepost: "Ngena ukuze uthumele kwakhona.",
		signInToComment: "Ngena ukuze ujoyine incoko.",
		addComment: "Yongeza uluvo…",
		commentPosted: "Uluvo luthunyelwe!",
		commentDeleted: "Uluvo lucinyiwe.",
		commentError: "Ayikwazanga ukuthumela uluvo.",
		likeError: "Ayikwazanga ukuhlaziya ukuthanda.",
		deleteError: "Ayikwazanga ukucima uluvo.",
		delete: "Cima",
		noComments: "Akukho zimvo okwangoku. Yiba ngowokuqala!",
		trending: "Ezidumileyo",
		noTrending: "Akukho hashtag idumileyo okwangoku.",
		postsCount: "iiposti ezingu-{{count}}",
		hashtagTitle: "#{{tag}}",
		hashtagCount: "iiposti ezingu-{{count}} ezine-hashtag",
		hashtagEmpty: "Azikho iiposti ze-#{{tag}} okwangoku.",
		trySomethingElse: "Zama ezi:",
		notifications: "Izaziso",
		notifAll: "Zonke",
		notifLikes: "Ukuthanda",
		notifFollows: "Ukulandela",
		notifComments: "Izimvo",
		notifEmpty: "Akukho zaziso okwangoku.",
		notifFollow: "{{name}} uqalisile ukukulandela",
		notifLikePost: "{{name}} uyithandile iposti yakho",
		notifLikeComment: "{{name}} uluthandile uluvo lwakho",
		notifComment: "{{name}} ugqabaze kwiposti yakho",
		notifMention: "{{name}} ukukhankanyile",
		notifRepost: "{{name}} uyithumele kwakhona iposti yakho",
		notifOther: "{{name}} usebenzisene nawe",
		follow: "Landela",
		unfollow: "Yeka ukulandela",
		followers: "abalandeli abangu-{{count}}",
		following: "Uyalandela",
		signInToFollow: "Ngena ukuze ulandele.",
		trustScore: "Amanqaku okuthembeka",
		profileTitle: "Iprofayile",
		profileNotFound: "Le profayile ayifumanekanga.",
		postNotFound: "Le posti ayifumanekanga.",
		postsBy: "Iiposti zika-{{name}}",
		noPosts: "Azikho iiposti okwangoku.",
		backToFeed: "Buyela kwifidi",
		unavailable: "Ayifumaneki",
		loadFailed: "Asikwazanga ukulayisha eli phepha. Zama kwakhona."
	},
	st: {
		comment: "Fana maikutlo",
		comments: "Maikutlo",
		like: "Rata",
		repost: "Romela hape",
		share: "Arolelana",
		linkCopied: "Sehokelo se kopitsitsoe!",
		signInToLike: "Kena ho rata.",
		signInToRepost: "Kena ho romela hape.",
		signInToComment: "Kena ho kenela puisano.",
		addComment: "Eketsa maikutlo…",
		commentPosted: "Maikutlo a rometsoe!",
		commentDeleted: "Maikutlo a hlakotsoe.",
		commentError: "Ha ea khona ho romela maikutlo.",
		likeError: "Ha ea khona ho ntlafatsa ho rata.",
		deleteError: "Ha ea khona ho hlakola maikutlo.",
		delete: "Hlakola",
		noComments: "Ha ho maikutlo hajoale. Eba oa pele!",
		trending: "Tse tumeng",
		noTrending: "Ha ho li-hashtag tse tumeng hajoale.",
		postsCount: "diposo tse {{count}}",
		hashtagTitle: "#{{tag}}",
		hashtagCount: "diposo tse {{count}} tse nang le hashtag ena",
		hashtagEmpty: "Ha ho diposo tsa #{{tag}} hajoale.",
		trySomethingElse: "Leka tsena:",
		notifications: "Ditsebiso",
		notifAll: "Tsohle",
		notifLikes: "Ho rata",
		notifFollows: "Ho latela",
		notifComments: "Maikutlo",
		notifEmpty: "Ha ho ditsebiso hajoale.",
		notifFollow: "{{name}} o qadile ho o latela",
		notifLikePost: "{{name}} o ratile poso ya hao",
		notifLikeComment: "{{name}} o ratile maikutlo a hao",
		notifComment: "{{name}} o fane ka maikutlo posong ya hao",
		notifMention: "{{name}} o o boletse",
		notifRepost: "{{name}} o romelletse poso ya hao hape",
		notifOther: "{{name}} o sebelisane le wena",
		follow: "Latela",
		unfollow: "Tlohela ho latela",
		followers: "balatedi ba {{count}}",
		following: "Oa latela",
		signInToFollow: "Kena ho latela batho.",
		trustScore: "Lintlha tsa tshepo",
		profileTitle: "Profaele",
		profileNotFound: "Profaele ena ha ea fumanoa.",
		postNotFound: "Poso ena ha ea fumanoa.",
		postsBy: "Diposo tsa {{name}}",
		noPosts: "Ha ho diposo hajoale.",
		backToFeed: "Khutlela feed-ing",
		unavailable: "Ha e fumanehe",
		loadFailed: "Ha rea khona ho jara leqephe lena. Leka hape."
	},
	af: {
		comment: "Lewer kommentaar",
		comments: "Kommentaar",
		like: "Hou van",
		repost: "Herplaas",
		share: "Deel",
		linkCopied: "Skakel gekopieer!",
		signInToLike: "Meld aan om te hou van.",
		signInToRepost: "Meld aan om te herplaas.",
		signInToComment: "Meld aan om deel te neem.",
		addComment: "Voeg kommentaar by…",
		commentPosted: "Kommentaar geplaas!",
		commentDeleted: "Kommentaar verwyder.",
		commentError: "Kon nie kommentaar plaas nie.",
		likeError: "Kon nie die 'hou van' opdateer nie.",
		deleteError: "Kon nie kommentaar verwyder nie.",
		delete: "Verwyder",
		noComments: "Nog geen kommentaar nie. Wees eerste!",
		trending: "Gewild",
		noTrending: "Nog geen gewilde hutsmerke nie.",
		postsCount: "{{count}} plasings",
		hashtagTitle: "#{{tag}}",
		hashtagCount: "{{count}} plasings met hierdie hutsmerk",
		hashtagEmpty: "Nog geen plasings met #{{tag}} nie.",
		trySomethingElse: "Probeer eerder hierdie:",
		notifications: "Kennisgewings",
		notifAll: "Alles",
		notifLikes: "Hou van",
		notifFollows: "Volg",
		notifComments: "Kommentaar",
		notifEmpty: "Nog geen kennisgewings nie.",
		notifFollow: "{{name}} volg jou nou",
		notifLikePost: "{{name}} hou van jou plasing",
		notifLikeComment: "{{name}} hou van jou kommentaar",
		notifComment: "{{name}} het op jou plasing gereageer",
		notifMention: "{{name}} het jou genoem",
		notifRepost: "{{name}} het jou plasing herplaas",
		notifOther: "{{name}} het met jou omgegaan",
		follow: "Volg",
		unfollow: "Ontvolg",
		followers: "{{count}} volgelinge",
		following: "Volg tans",
		signInToFollow: "Meld aan om te volg.",
		trustScore: "Vertrouenstelling",
		profileTitle: "Profiel",
		profileNotFound: "Hierdie profiel is nie gevind nie.",
		postNotFound: "Hierdie plasing is nie gevind nie.",
		postsBy: "Plasings deur {{name}}",
		noPosts: "Nog geen plasings nie.",
		backToFeed: "Terug na die voer",
		unavailable: "Nie beskikbaar nie",
		loadFailed: "Ons kon nie hierdie bladsy laai nie. Probeer weer."
	}
};
var LANGUAGES = [
	{
		code: "en",
		label: "English"
	},
	{
		code: "es",
		label: "Español"
	},
	{
		code: "fr",
		label: "Français"
	},
	{
		code: "de",
		label: "Deutsch"
	},
	{
		code: "pt",
		label: "Português"
	},
	{
		code: "it",
		label: "Italiano"
	},
	{
		code: "nl",
		label: "Nederlands"
	},
	{
		code: "pl",
		label: "Polski"
	},
	{
		code: "ro",
		label: "Română"
	},
	{
		code: "sv",
		label: "Svenska"
	},
	{
		code: "no",
		label: "Norsk"
	},
	{
		code: "da",
		label: "Dansk"
	},
	{
		code: "fi",
		label: "Suomi"
	},
	{
		code: "cs",
		label: "Čeština"
	},
	{
		code: "hu",
		label: "Magyar"
	},
	{
		code: "el",
		label: "Ελληνικά"
	},
	{
		code: "uk",
		label: "Українська"
	},
	{
		code: "ru",
		label: "Русский"
	},
	{
		code: "tr",
		label: "Türkçe"
	},
	{
		code: "ar",
		label: "العربية"
	},
	{
		code: "he",
		label: "עברית"
	},
	{
		code: "fa",
		label: "فارسی"
	},
	{
		code: "ur",
		label: "اردو"
	},
	{
		code: "hi",
		label: "हिन्दी"
	},
	{
		code: "bn",
		label: "বাংলা"
	},
	{
		code: "ta",
		label: "தமிழ்"
	},
	{
		code: "te",
		label: "తెలుగు"
	},
	{
		code: "mr",
		label: "मराठी"
	},
	{
		code: "gu",
		label: "ગુજરાતી"
	},
	{
		code: "pa",
		label: "ਪੰਜਾਬੀ"
	},
	{
		code: "th",
		label: "ไทย"
	},
	{
		code: "vi",
		label: "Tiếng Việt"
	},
	{
		code: "id",
		label: "Bahasa Indonesia"
	},
	{
		code: "ms",
		label: "Bahasa Melayu"
	},
	{
		code: "fil",
		label: "Filipino"
	},
	{
		code: "zh-CN",
		label: "简体中文（中国大陆）"
	},
	{
		code: "zh-TW",
		label: "繁體中文（台灣）"
	},
	{
		code: "ja",
		label: "日本語"
	},
	{
		code: "ko",
		label: "한국어"
	},
	{
		code: "sw",
		label: "Kiswahili"
	},
	{
		code: "am",
		label: "አማርኛ"
	},
	{
		code: "zu",
		label: "isiZulu"
	},
	{
		code: "xh",
		label: "isiXhosa"
	},
	{
		code: "st",
		label: "Sesotho"
	},
	{
		code: "tn",
		label: "Setswana"
	},
	{
		code: "af",
		label: "Afrikaans"
	},
	{
		code: "ha",
		label: "Hausa"
	},
	{
		code: "yo",
		label: "Yorùbá"
	},
	{
		code: "ig",
		label: "Igbo"
	},
	{
		code: "nso",
		label: "Sepedi"
	},
	{
		code: "sk",
		label: "Slovenčina"
	},
	{
		code: "bg",
		label: "Български"
	}
];
var RTL_LANGUAGES = [
	"ar",
	"he",
	"fa",
	"ur"
];
LANGUAGES.length;
var resources = { en: { translation: en } };
var codes = /* @__PURE__ */ new Set([...Object.keys(translations), ...Object.keys(socialTranslations)]);
for (const code of codes) {
	const bundle = { ...translations[code] ?? {} };
	const social = socialTranslations[code];
	if (social) bundle.social = {
		...bundle.social,
		...social
	};
	const merged = { ...en };
	for (const [section, values] of Object.entries(bundle)) merged[section] = {
		...en[section],
		...values
	};
	resources[code] = { translation: merged };
}
resources["zh-CN"] = resources.zh ?? { translation: en };
resources["zh-TW"] = resources["zh-TW"] ?? resources.zh ?? { translation: en };
resources.nso = { translation: {
	...en,
	nav: {
		...en.nav,
		feed: "Dikagare",
		brands: "Mabrande",
		awards: "Difofane",
		signIn: "Tsena"
	},
	vote: {
		...en.vote,
		stash: "Boloka",
		trash: "Lahla",
		signInPrompt: "Tsena go fana ka kahlolo ya gago."
	},
	auth: {
		...en.auth,
		signIn: "Tsena",
		signUp: "Ingwadise",
		email: "Imeile",
		password: "Phasewete",
		continueGoogle: "Tsena ka Google"
	}
} };
if (!instance.isInitialized) instance.use(Browser).use(initReactI18next).init({
	resources,
	fallbackLng: "en",
	supportedLngs: LANGUAGES.map((l) => l.code),
	nonExplicitSupportedLngs: true,
	interpolation: { escapeValue: false },
	initImmediate: false,
	detection: {
		order: ["localStorage", "navigator"],
		caches: ["localStorage"],
		lookupLocalStorage: "sot-lang"
	}
});
function useRoles() {
	const { user } = useAuth();
	const query = useQuery({
		queryKey: ["roles", user?.id ?? "anon"],
		enabled: !!user,
		queryFn: async () => {
			const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
			if (error) throw error;
			return (data ?? []).map((r) => r.role);
		}
	});
	const roles = query.data ?? [];
	return {
		roles,
		isAdmin: roles.includes("admin"),
		isBrand: roles.includes("brand"),
		loading: query.isLoading
	};
}
function useUnreadCount(userId) {
	const [count, setCount] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (!userId) {
			setCount(0);
			return;
		}
		let mounted = true;
		const load = async () => {
			const { count: c } = await supabase.from("messages").select("id", {
				count: "exact",
				head: true
			}).eq("recipient_id", userId).is("read_at", null);
			if (mounted) setCount(c ?? 0);
		};
		load();
		const channel = supabase.channel(`unread-${userId}`).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "messages",
			filter: `recipient_id=eq.${userId}`
		}, () => load()).subscribe();
		return () => {
			mounted = false;
			supabase.removeChannel(channel);
		};
	}, [userId]);
	return count;
}
/** Live unread notification count for the signed-in user. */
function useUnreadNotifications(userId) {
	const [count, setCount] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (!userId) {
			setCount(0);
			return;
		}
		let mounted = true;
		const load = async () => {
			const { count: c } = await supabase.from("notifications").select("id", {
				count: "exact",
				head: true
			}).eq("user_id", userId).is("read_at", null);
			if (mounted) setCount(c ?? 0);
		};
		load();
		const channel = supabase.channel(`unread-notifs-${userId}`).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "notifications",
			filter: `user_id=eq.${userId}`
		}, () => load()).subscribe();
		return () => {
			mounted = false;
			supabase.removeChannel(channel);
		};
	}, [userId]);
	return count;
}
var MAX_DIM = 512;
function guessMime(name) {
	const ext = name.split(".").pop()?.toLowerCase() ?? "";
	if (ext === "png") return "image/png";
	if (ext === "webp") return "image/webp";
	if (ext === "gif") return "image/gif";
	if (ext === "avif") return "image/avif";
	return "image/jpeg";
}
async function sha256Hex(buf) {
	try {
		if (!globalThis.crypto?.subtle) return null;
		const d = await globalThis.crypto.subtle.digest("SHA-256", buf);
		return Array.from(new Uint8Array(d)).map((b) => b.toString(16).padStart(2, "0")).join("");
	} catch {
		return null;
	}
}
function scanMetadata(buf) {
	const bytes = new Uint8Array(buf);
	const head = bytes.slice(0, Math.min(bytes.length, 65536));
	const tail = bytes.slice(Math.max(0, bytes.length - 8192));
	const dec = new TextDecoder("latin1");
	const full = dec.decode(head) + dec.decode(tail);
	return {
		cameraMetadata: /Exif|eXIf|xmp|JFIF/i.test(full),
		c2pa: /c2pa|jumbf/i.test(full)
	};
}
async function decodePixels(file) {
	try {
		if (typeof document === "undefined") return null;
		let w = 0, h = 0;
		let drawn;
		if (typeof createImageBitmap === "function") {
			const bmp = await createImageBitmap(file);
			w = bmp.width;
			h = bmp.height;
			drawn = bmp;
		} else {
			const url = URL.createObjectURL(file);
			const im = await new Promise((res, rej) => {
				const el = new Image();
				el.onload = () => res(el);
				el.onerror = () => rej(/* @__PURE__ */ new Error("decode failed"));
				el.src = url;
			});
			w = im.naturalWidth;
			h = im.naturalHeight;
			drawn = im;
		}
		const scale = Math.min(1, MAX_DIM / Math.max(w, h));
		const cw = Math.max(1, Math.round(w * scale));
		const ch = Math.max(1, Math.round(h * scale));
		const canvas = document.createElement("canvas");
		canvas.width = cw;
		canvas.height = ch;
		const ctx = canvas.getContext("2d", { willReadFrequently: true });
		if (!ctx) return null;
		ctx.drawImage(drawn, 0, 0, cw, ch);
		return {
			data: ctx.getImageData(0, 0, cw, ch).data,
			width: cw,
			height: ch
		};
	} catch {
		return null;
	}
}
function pooledGray(data, w, h, pw = 9, ph = 8) {
	const out = new Uint8Array(pw * ph);
	const bx = w / pw, by = h / ph;
	for (let y = 0; y < ph; y++) for (let x = 0; x < pw; x++) {
		const x0 = Math.floor(x * bx), x1 = Math.ceil((x + 1) * bx);
		const y0 = Math.floor(y * by), y1 = Math.ceil((y + 1) * by);
		let sum = 0, count = 0;
		for (let yy = y0; yy < y1 && yy < h; yy++) for (let xx = x0; xx < x1 && xx < w; xx++) {
			const i = (yy * w + xx) * 4;
			sum += .299 * data[i] + .587 * data[i + 1] + .114 * data[i + 2];
			count++;
		}
		out[y * pw + x] = count ? Math.round(sum / count) : 0;
	}
	return out;
}
function dHashHex(gray, w = 9, h = 8) {
	let bits = "";
	for (let y = 0; y < h; y++) for (let x = 0; x < w - 1; x++) bits += gray[y * w + x] > gray[y * w + x + 1] ? "1" : "0";
	let hex = "";
	for (let i = 0; i < bits.length; i += 4) hex += parseInt(bits.slice(i, i + 4), 2).toString(16);
	return hex;
}
function hamming(a, b) {
	if (a.length !== b.length) return 64;
	let d = 0;
	for (let i = 0; i < a.length; i++) {
		let x = parseInt(a[i], 16) ^ parseInt(b[i], 16);
		while (x) {
			d += x & 1;
			x >>= 1;
		}
	}
	return d;
}
async function analyzeImage(file) {
	const bytes = file.size;
	const mime = file.type || guessMime(file.name);
	const buf = await file.arrayBuffer();
	const sha = await sha256Hex(buf);
	const meta = scanMetadata(buf);
	const notes = [];
	if (meta.c2pa) notes.push("C2PA/JUMBF content-credentials marker present");
	if (!meta.cameraMetadata) notes.push("No embedded camera/EXIF metadata found");
	const flags = [];
	const px = await decodePixels(file);
	let phash = null, width = null, height = null;
	let tier = "clean";
	if (px) {
		width = px.width;
		height = px.height;
		phash = dHashHex(pooledGray(px.data, px.width, px.height, 9, 8), 9, 8);
	} else {
		tier = "inconclusive";
		flags.push("Could not decode pixels for perceptual hashing");
	}
	return {
		tier,
		sha256: sha,
		phash,
		width,
		height,
		bytes,
		mime,
		provenance: {
			camera_metadata: meta.cameraMetadata,
			c2pa: meta.c2pa,
			notes
		},
		flags,
		detectors: [
			{
				name: "sightengine",
				activated: false
			},
			{
				name: "hive",
				activated: false
			},
			{
				name: "aiornot",
				activated: false
			}
		]
	};
}
var BUCKET = "item-images";
var ITEM_SELECT = "id, user_id, title, description, image_url, created_at, brand_id, category, audit, phash";
var ITEM_SELECT_FALLBACK = "id, user_id, title, description, image_url, created_at, brand_id, category";
function colError(e) {
	const msg = String(e?.message ?? "");
	return /audit|phash|column|42703/i.test(msg);
}
async function signImages(paths) {
	const unique = [...new Set(paths.filter((p) => !!p))];
	const map = /* @__PURE__ */ new Map();
	if (unique.length === 0) return map;
	const { data } = await supabase.storage.from(BUCKET).createSignedUrls(unique, 604800);
	data?.forEach((entry) => {
		if (entry.signedUrl && entry.path) map.set(entry.path, entry.signedUrl);
	});
	return map;
}
async function fetchFeed(currentUserId, opts) {
	const q = supabase.from("items").select(ITEM_SELECT).order("created_at", { ascending: false });
	const first = await (opts?.brandId ? q.eq("brand_id", opts.brandId) : q);
	let items = first.data;
	let error = first.error;
	if (error && colError(error)) {
		const fb = supabase.from("items").select(ITEM_SELECT_FALLBACK).order("created_at", { ascending: false });
		const second = await (opts?.brandId ? fb.eq("brand_id", opts.brandId) : fb);
		items = second.data;
		error = second.error;
	}
	if (error) throw error;
	if (!items || items.length === 0) return [];
	const itemIds = items.map((i) => i.id);
	const authorIds = [...new Set(items.map((i) => i.user_id))];
	const brandIds = [...new Set(items.map((i) => i.brand_id).filter((b) => !!b))];
	const [{ data: votes }, { data: profiles }, brandsRes, signed] = await Promise.all([
		supabase.from("votes").select("item_id, user_id, verdict").in("item_id", itemIds),
		supabase.from("profiles").select("id, display_name").in("id", authorIds),
		brandIds.length ? supabase.from("brands").select("id, name, slug, logo_url, country").in("id", brandIds) : Promise.resolve({ data: [] }),
		signImages(items.map((i) => i.image_url))
	]);
	const nameById = new Map((profiles ?? []).map((p) => [p.id, p.display_name]));
	const brandById = new Map((brandsRes.data ?? []).map((b) => [b.id, b]));
	const brandLogos = await signImages((brandsRes.data ?? []).map((b) => b.logo_url ?? null).filter((u) => !!u && !/^https?:\/\//i.test(u)));
	return items.map((item) => {
		const itemVotes = (votes ?? []).filter((v) => v.item_id === item.id);
		const brand = item.brand_id ? brandById.get(item.brand_id) : null;
		return {
			...item,
			authorName: nameById.get(item.user_id) ?? "Anonymous",
			brandName: brand?.name ?? null,
			brandSlug: brand?.slug ?? null,
			brandCountry: brand?.country ?? null,
			brandLogoUrl: (() => {
				const logo = brand?.logo_url ?? null;
				if (!logo) return null;
				return /^https?:\/\//i.test(logo) ? logo : brandLogos.get(logo) ?? null;
			})(),
			stashCount: itemVotes.filter((v) => v.verdict === "stash").length,
			trashCount: itemVotes.filter((v) => v.verdict === "trash").length,
			myVerdict: (currentUserId ? itemVotes.find((v) => v.user_id === currentUserId)?.verdict : void 0) ?? null,
			signedImageUrl: item.image_url ? signed.get(item.image_url) ?? null : null,
			audit: item.audit ?? null,
			phash: item.phash ?? null
		};
	});
}
async function castVote(itemId, userId, verdict) {
	const { error } = await supabase.from("votes").upsert({
		item_id: itemId,
		user_id: userId,
		verdict
	}, { onConflict: "item_id,user_id" });
	if (error) throw error;
}
async function removeVote(itemId, userId) {
	const { error } = await supabase.from("votes").delete().eq("item_id", itemId).eq("user_id", userId);
	if (error) throw error;
}
async function createItem(input) {
	let imagePath = null;
	let audit = null;
	let phash = null;
	if (input.file) {
		const ext = input.file.name.split(".").pop() ?? "jpg";
		const path = `${input.userId}/${crypto.randomUUID()}.${ext}`;
		const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, input.file, { upsert: false });
		if (upErr) throw upErr;
		imagePath = path;
		audit = await analyzeImage(input.file).catch(() => null);
		phash = audit?.phash ?? null;
		if (phash && audit) {
			const myPhash = phash;
			const baseAudit = audit;
			try {
				const { data: recent } = await supabase.from("items").select("phash").not("phash", "is", null).order("created_at", { ascending: false }).limit(200);
				if ((recent ?? []).find((r) => typeof r.phash === "string" && hamming(myPhash, r.phash) <= 4)) audit = {
					...baseAudit,
					tier: "reused",
					flags: [...baseAudit.flags, "Near-duplicate of an existing post detected"]
				};
			} catch {}
		}
	}
	const base = {
		user_id: input.userId,
		title: input.title.trim(),
		description: input.description.trim() || null,
		image_url: imagePath,
		brand_id: input.brandId || null,
		category: input.category?.trim() || null
	};
	let inserted = await supabase.from("items").insert({
		...base,
		audit,
		phash
	}).select("id").single();
	if (inserted.error && colError(inserted.error)) inserted = await supabase.from("items").insert(base).select("id").single();
	if (inserted.error) throw inserted.error;
	if (input.verdict && inserted.data?.id) await castVote(inserted.data.id, input.userId, input.verdict).catch(() => void 0);
}
async function deleteItem(itemId) {
	const { error } = await supabase.from("items").delete().eq("id", itemId);
	if (error) throw error;
}
/** Single post with its verdict counts (public read). */
async function fetchItem(itemId, currentUserId) {
	const q1 = await supabase.from("items").select(ITEM_SELECT).eq("id", itemId).maybeSingle();
	let item = q1.data;
	let error = q1.error;
	if (error && colError(error)) {
		const q2 = await supabase.from("items").select(ITEM_SELECT_FALLBACK).eq("id", itemId).maybeSingle();
		item = q2.data;
		error = q2.error;
	}
	if (error) throw error;
	if (!item) return null;
	const [{ data: votes }, { data: profile }, brandRes, signed] = await Promise.all([
		supabase.from("votes").select("item_id, user_id, verdict").eq("item_id", itemId),
		supabase.from("profiles").select("id, display_name").eq("id", item.user_id).maybeSingle(),
		item.brand_id ? supabase.from("brands").select("id, name, slug, logo_url").eq("id", item.brand_id).maybeSingle() : Promise.resolve({ data: null }),
		signImages([item.image_url])
	]);
	const rawLogo = brandRes.data?.logo_url ?? null;
	const brandLogoUrl = rawLogo ? /^https?:\/\//i.test(rawLogo) ? rawLogo : (await signImages([rawLogo])).get(rawLogo) ?? null : null;
	const itemVotes = votes ?? [];
	return {
		...item,
		authorName: profile?.display_name ?? "Anonymous",
		brandName: brandRes.data?.name ?? null,
		brandSlug: brandRes.data?.slug ?? null,
		brandLogoUrl,
		stashCount: itemVotes.filter((v) => v.verdict === "stash").length,
		trashCount: itemVotes.filter((v) => v.verdict === "trash").length,
		myVerdict: (currentUserId ? itemVotes.find((v) => v.user_id === currentUserId)?.verdict : void 0) ?? null,
		signedImageUrl: item.image_url ? signed.get(item.image_url) ?? null : null,
		audit: item.audit ?? null,
		phash: item.phash ?? null
	};
}
/** Posts authored by one user. */
async function fetchUserItems(userId, currentUserId) {
	return (await fetchFeed(currentUserId)).filter((i) => i.user_id === userId);
}
var entries = [
	[
		"KOO",
		"Tinned Fruit",
		"Agriculture & Food Production"
	],
	[
		"KOO",
		"Tinned/Canned Beans",
		"Agriculture & Food Production"
	],
	[
		"KOO",
		"Tinned Vegetables",
		"Agriculture & Food Production"
	],
	[
		"Black Cat",
		"Peanut Butter & Spreads",
		"Consumer Goods"
	],
	[
		"Jungle Oats",
		"Breakfast Cereals & Oats",
		"Consumer Goods"
	],
	[
		"Doom",
		"Insecticides & Repellents",
		"Consumer Goods"
	],
	[
		"Fatti's & Moni's",
		"Pasta",
		"Agriculture & Food Production"
	],
	[
		"All Gold",
		"Jams & Marmalade",
		"Agriculture & Food Production"
	],
	[
		"Energade",
		"Sports Drinks",
		"Sports & Recreation"
	],
	[
		"Bathu",
		"Sneakers & Footwear",
		"Fashion & Apparel"
	],
	[
		"Drip Footwear",
		"Sneakers & Footwear",
		"Fashion & Apparel"
	],
	[
		"Veldskoen",
		"Footwear",
		"Fashion & Apparel"
	],
	[
		"GALXBOY",
		"Streetwear & Apparel",
		"Fashion & Apparel"
	],
	[
		"TSHEPO Denim",
		"Denim & Apparel",
		"Fashion & Apparel"
	],
	[
		"S.P.C.C",
		"Streetwear & Apparel",
		"Fashion & Apparel"
	],
	[
		"Freedom of Movement",
		"Apparel",
		"Fashion & Apparel"
	],
	[
		"Loxion Kulca",
		"Streetwear & Apparel",
		"Fashion & Apparel"
	],
	[
		"MaXhosa Africa",
		"High Fashion & Designer",
		"Luxury & Premium"
	],
	[
		"Rich Mnisi",
		"High Fashion & Designer",
		"Luxury & Premium"
	],
	[
		"Thebe Magugu",
		"High Fashion & Designer",
		"Luxury & Premium"
	],
	[
		"Pichulik",
		"Jewellery & Accessories",
		"Fashion & Apparel"
	],
	[
		"Kirsten Goss",
		"Jewellery & Accessories",
		"Fashion & Apparel"
	],
	[
		"Bellaghy Leather",
		"Leather Accessories",
		"Fashion & Apparel"
	],
	[
		"First Ascent",
		"Technical Outerwear & Gear",
		"Sports & Recreation"
	],
	[
		"Cape Union Mart",
		"Outdoor Gear & Lifestyle",
		"Retail & E-commerce"
	],
	[
		"Hi-Tec SA",
		"Outdoor Footwear & Gear",
		"Sports & Recreation"
	],
	[
		"African Nature",
		"Safari & Lifestyle",
		"Travel, Tourism & Hospitality"
	],
	[
		"Jonsson Workwear",
		"Workwear",
		"Consumer Goods"
	],
	[
		"OTG Active",
		"Activewear & Fitness",
		"Sports & Recreation"
	],
	[
		"Viva Athletics",
		"Activewear & Fitness",
		"Sports & Recreation"
	],
	[
		"Mrs Ball's",
		"Chutney & Pantry",
		"Agriculture & Food Production"
	],
	[
		"Tastic",
		"Rice & Pantry Staples",
		"Agriculture & Food Production"
	],
	[
		"Beacon",
		"Snacks & Sweets",
		"Consumer Goods"
	],
	[
		"Sally Williams",
		"Snacks & Sweets",
		"Consumer Goods"
	],
	[
		"NikNaks",
		"Snacks & Sweets",
		"Consumer Goods"
	],
	[
		"Chappies",
		"Confectionery",
		"Consumer Goods"
	],
	[
		"Clover",
		"Dairy & Proteins",
		"Agriculture & Food Production"
	],
	[
		"Fair Cape",
		"Dairy",
		"Agriculture & Food Production"
	],
	[
		"Eskort",
		"Meat & Proteins",
		"Agriculture & Food Production"
	],
	[
		"Oros",
		"Soft Drinks & Juices",
		"Agriculture & Food Production"
	],
	[
		"Ceres",
		"Soft Drinks & Juices",
		"Agriculture & Food Production"
	],
	[
		"BOS Iced Tea",
		"Soft Drinks & Juices",
		"Agriculture & Food Production"
	],
	[
		"Amarula",
		"Spirits & Liqueurs",
		"Consumer Goods"
	],
	[
		"Inverroche Gin",
		"Spirits & Liqueurs",
		"Consumer Goods"
	],
	[
		"Musgrave Gin",
		"Spirits & Liqueurs",
		"Consumer Goods"
	],
	[
		"KWV",
		"Wine & Spirits",
		"Consumer Goods"
	],
	[
		"Castle Lager",
		"Beer",
		"Consumer Goods"
	],
	[
		"Savanna Cider",
		"Cider",
		"Consumer Goods"
	],
	[
		"Devil's Peak Beer",
		"Craft Beer",
		"Consumer Goods"
	],
	[
		"Africology",
		"Skincare & Body",
		"Beauty & Personal Care"
	],
	[
		"Portia M",
		"Skincare & Haircare",
		"Beauty & Personal Care"
	],
	[
		"Woolworths Beauty",
		"Beauty Retail",
		"Beauty & Personal Care"
	],
	[
		"Inuka",
		"Beauty & Personal Care",
		"Beauty & Personal Care"
	],
	[
		"Native Child",
		"Haircare",
		"Beauty & Personal Care"
	],
	[
		"AfroBotanics",
		"Haircare",
		"Beauty & Personal Care"
	],
	[
		"Ardmore",
		"Decor & Textiles",
		"Home, Furniture & Living"
	],
	[
		"Skinny laMinx",
		"Decor & Textiles",
		"Home, Furniture & Living"
	],
	[
		"Mash T Design",
		"Home Design",
		"Home, Furniture & Living"
	],
	[
		"Rain",
		"Home Fragrance & Bath",
		"Home, Furniture & Living"
	],
	[
		"Charlotte Rhys",
		"Home Fragrance & Bath",
		"Home, Furniture & Living"
	],
	[
		"Flickering Grace",
		"Home Fragrance & Bath",
		"Home, Furniture & Living"
	]
];
function slugifySeed(value) {
	return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
var INTERNATIONAL_SEED_BRANDS = [
	[
		"Dangote",
		"Conglomerate",
		"Business & Finance",
		"NG"
	],
	[
		"Jumia",
		"E-commerce",
		"Retail & E-commerce",
		"NG"
	],
	[
		"Safaricom",
		"Telecommunications",
		"Technology & Telecom",
		"KE"
	],
	[
		"M-PESA",
		"Mobile payments",
		"Technology & Telecom",
		"KE"
	],
	[
		"MTN",
		"Telecommunications",
		"Technology & Telecom",
		"GH"
	],
	[
		"Ethiopian Airlines",
		"Airline",
		"Travel, Tourism & Hospitality",
		"ET"
	],
	[
		"Emirates",
		"Airline",
		"Travel, Tourism & Hospitality",
		"AE"
	],
	[
		"Tata",
		"Conglomerate",
		"Business & Finance",
		"IN"
	],
	[
		"Infosys",
		"Technology services",
		"Technology & Telecom",
		"IN"
	],
	[
		"Toyota",
		"Automotive",
		"Automotive & Mobility",
		"JP"
	],
	[
		"Sony",
		"Electronics",
		"Technology & Telecom",
		"JP"
	],
	[
		"Samsung",
		"Electronics",
		"Technology & Telecom",
		"KR"
	],
	[
		"Alibaba",
		"E-commerce",
		"Retail & E-commerce",
		"CN"
	],
	[
		"L'Oréal",
		"Beauty",
		"Beauty & Personal Care",
		"FR"
	],
	[
		"IKEA",
		"Furniture",
		"Home, Furniture & Living",
		"SE"
	],
	[
		"Adidas",
		"Sportswear",
		"Fashion & Apparel",
		"DE"
	],
	[
		"LEGO",
		"Toys",
		"Consumer Goods",
		"DK"
	],
	[
		"Spotify",
		"Music streaming",
		"Media & Entertainment",
		"SE"
	],
	[
		"Natura",
		"Beauty",
		"Beauty & Personal Care",
		"BR"
	],
	[
		"Mercado Libre",
		"E-commerce",
		"Retail & E-commerce",
		"AR"
	],
	[
		"Coca-Cola",
		"Beverages",
		"Agriculture & Food Production",
		"US"
	],
	[
		"Microsoft",
		"Software",
		"Technology & Telecom",
		"US"
	],
	[
		"Shopify",
		"E-commerce software",
		"Technology & Telecom",
		"CA"
	],
	[
		"Canva",
		"Design software",
		"Technology & Telecom",
		"AU"
	],
	[
		"Zara",
		"Fashion retail",
		"Fashion & Apparel",
		"ES"
	],
	[
		"Nestlé",
		"Food & Beverage",
		"Agriculture & Food Production",
		"CH"
	],
	[
		"LVMH",
		"Luxury goods",
		"Luxury & Premium",
		"FR"
	],
	[
		"Heineken",
		"Beverages",
		"Consumer Goods",
		"NL"
	],
	[
		"Mercadona",
		"Supermarkets",
		"Retail & E-commerce",
		"ES"
	],
	[
		"Beko",
		"Home appliances",
		"Home, Furniture & Living",
		"TR"
	],
	[
		"MobiPay",
		"Mobile payments",
		"Technology & Telecom",
		"TZ"
	],
	[
		"Vodacom Tanzania",
		"Telecommunications",
		"Technology & Telecom",
		"TZ"
	],
	[
		"Zamtel",
		"Telecommunications",
		"Technology & Telecom",
		"ZM"
	],
	[
		"Shoprite Zambia",
		"Retail",
		"Retail & E-commerce",
		"ZM"
	],
	[
		"MTC Namibia",
		"Telecommunications",
		"Technology & Telecom",
		"NA"
	],
	[
		"First National Bank Namibia",
		"Banking",
		"Business & Finance",
		"NA"
	],
	[
		"AIB",
		"Banking",
		"Business & Finance",
		"IE"
	],
	[
		"Ryanair",
		"Airline",
		"Travel, Tourism & Hospitality",
		"IE"
	],
	[
		"H&M",
		"Fashion retail",
		"Fashion & Apparel",
		"SE"
	],
	[
		"Ericsson",
		"Telecommunications",
		"Technology & Telecom",
		"SE"
	],
	[
		"ABB",
		"Engineering",
		"Industrial & Manufacturing",
		"CH"
	],
	[
		"UBS",
		"Banking",
		"Business & Finance",
		"CH"
	],
	[
		"Sasol",
		"Energy and chemicals",
		"Energy & Utilities",
		"ZA"
	],
	[
		"Safaricom Ethiopia",
		"Telecommunications",
		"Technology & Telecom",
		"ET"
	],
	[
		"KCB Group",
		"Banking",
		"Business & Finance",
		"KE"
	],
	[
		"Airtel Africa",
		"Telecommunications",
		"Technology & Telecom",
		"UG"
	],
	[
		"Sonatel",
		"Telecommunications",
		"Technology & Telecom",
		"SN"
	],
	[
		"Maroc Telecom",
		"Telecommunications",
		"Technology & Telecom",
		"MA"
	],
	[
		"Gulf Air",
		"Airline",
		"Travel, Tourism & Hospitality",
		"BH"
	],
	[
		"Qatar Airways",
		"Airline",
		"Travel, Tourism & Hospitality",
		"QA"
	],
	[
		"Etisalat",
		"Telecommunications",
		"Technology & Telecom",
		"AE"
	],
	[
		"Grab",
		"Mobility and delivery",
		"Technology & Telecom",
		"SG"
	],
	[
		"Gojek",
		"Mobility and delivery",
		"Technology & Telecom",
		"ID"
	],
	[
		"Kia",
		"Automotive",
		"Automotive & Mobility",
		"KR"
	],
	[
		"Lotte",
		"Conglomerate",
		"Consumer Goods",
		"KR"
	],
	[
		"Panasonic",
		"Electronics",
		"Technology & Telecom",
		"JP"
	],
	[
		"Rakuten",
		"E-commerce",
		"Retail & E-commerce",
		"JP"
	],
	[
		"BharatPe",
		"Payments",
		"Technology & Telecom",
		"IN"
	],
	[
		"Wipro",
		"Technology services",
		"Technology & Telecom",
		"IN"
	],
	[
		"DHL",
		"Logistics",
		"Transport & Logistics",
		"DE"
	],
	[
		"Siemens",
		"Engineering",
		"Industrial & Manufacturing",
		"DE"
	],
	[
		"Danone",
		"Food & Beverage",
		"Agriculture & Food Production",
		"FR"
	],
	[
		"Carrefour",
		"Retail",
		"Retail & E-commerce",
		"FR"
	],
	[
		"Volvo",
		"Automotive",
		"Automotive & Mobility",
		"SE"
	],
	[
		"Maersk",
		"Shipping and logistics",
		"Transport & Logistics",
		"DK"
	],
	[
		"Klarna",
		"Payments",
		"Technology & Telecom",
		"SE"
	],
	[
		"Patagonia",
		"Outdoor apparel",
		"Fashion & Apparel",
		"US"
	],
	[
		"Nike",
		"Sportswear",
		"Fashion & Apparel",
		"US"
	],
	[
		"Tim Hortons",
		"Food service",
		"Travel, Tourism & Hospitality",
		"CA"
	],
	[
		"Qantas",
		"Airline",
		"Travel, Tourism & Hospitality",
		"AU"
	],
	[
		"Woolworths Australia",
		"Retail",
		"Retail & E-commerce",
		"AU"
	],
	[
		"Falabella",
		"Retail",
		"Retail & E-commerce",
		"CL"
	],
	[
		"Bancolombia",
		"Banking",
		"Business & Finance",
		"CO"
	],
	[
		"YPF",
		"Energy",
		"Energy & Utilities",
		"AR"
	],
	[
		"Havaianas",
		"Footwear",
		"Fashion & Apparel",
		"BR"
	],
	[
		"Pemex",
		"Energy",
		"Energy & Utilities",
		"MX"
	],
	[
		"Kcell",
		"Telecommunications",
		"Technology & Telecom",
		"KZ"
	],
	[
		"LOT Polish Airlines",
		"Airline",
		"Travel, Tourism & Hospitality",
		"PL"
	],
	[
		"Allegro",
		"E-commerce",
		"Retail & E-commerce",
		"PL"
	],
	[
		"Norsk Hydro",
		"Materials",
		"Industrial & Manufacturing",
		"NO"
	],
	[
		"Equinor",
		"Energy",
		"Energy & Utilities",
		"NO"
	],
	[
		"Telia",
		"Telecommunications",
		"Technology & Telecom",
		"SE"
	]
].map(([name, descriptor, category, country], index) => ({
	id: `seed-global-${index + 1}`,
	owner_id: "seed-catalog",
	name,
	slug: `${slugifySeed(name)}-${country.toLowerCase()}`,
	description: `${descriptor} brand from ${country}. Community verification is still open.`,
	logo_url: null,
	website: null,
	category,
	country,
	verified: false,
	trust_score: 0,
	created_at: "2026-09-09T00:00:00.000Z",
	signedLogoUrl: null,
	ownerName: "SOT catalog"
}));
var SOUTH_AFRICAN_SEED_BRANDS = entries.map(([name, descriptor, category], index) => ({
	id: `seed-za-${index + 1}`,
	owner_id: "seed-catalog",
	name,
	slug: `${slugifySeed(name)}-za`,
	description: `${descriptor} brand catalogued for South Africa. Community verification is still open.`,
	logo_url: null,
	website: null,
	category,
	country: "ZA",
	verified: false,
	trust_score: 0,
	created_at: "2026-09-09T00:00:00.000Z",
	signedLogoUrl: null,
	ownerName: "SOT catalog"
}));
function slugify(name) {
	return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}
async function decorate(rows) {
	if (!rows.length) return [];
	const ownerIds = [...new Set(rows.map((b) => b.owner_id))];
	const storageLogos = rows.map((b) => b.logo_url).filter((url) => !!url && !/^https?:\/\//i.test(url));
	const [{ data: profiles }, signed] = await Promise.all([supabase.from("profiles").select("id, display_name").in("id", ownerIds), signImages(storageLogos)]);
	const nameById = new Map((profiles ?? []).map((p) => [p.id, p.display_name]));
	return rows.map((b) => ({
		...b,
		signedLogoUrl: b.logo_url ? /^https?:\/\//i.test(b.logo_url) ? b.logo_url : signed.get(b.logo_url) ?? null : null,
		ownerName: nameById.get(b.owner_id) ?? null
	}));
}
async function fetchBrands() {
	const fallback = [...INTERNATIONAL_SEED_BRANDS, ...SOUTH_AFRICAN_SEED_BRANDS];
	const { data, error } = await supabase.from("brands").select("*").order("trust_score", { ascending: false }).order("created_at", { ascending: false });
	if (error) {
		console.warn("Brand directory using fallback catalog:", error.message);
		return fallback;
	}
	try {
		const live = await decorate(data ?? []);
		const names = new Set(live.map((brand) => brand.name.trim().toLowerCase()));
		return [...live, ...fallback.filter((brand) => !names.has(brand.name.trim().toLowerCase()))];
	} catch (error) {
		console.warn("Brand directory fallback decoration failed:", error);
		return fallback;
	}
}
async function fetchMyBrands(ownerId) {
	const { data, error } = await supabase.from("brands").select("*").eq("owner_id", ownerId).order("created_at", { ascending: false });
	if (error) throw error;
	return decorate(data ?? []);
}
async function fetchBrandBySlug(slug) {
	const { data, error } = await supabase.from("brands").select("*").eq("slug", slug).maybeSingle();
	if (error) throw error;
	if (!data) return SOUTH_AFRICAN_SEED_BRANDS.find((brand) => brand.slug === slug) ?? null;
	return (await decorate([data]))[0] ?? null;
}
/** Strip SQL LIKE wildcards so a user's query matches literally. */
function sanitizeQuery(q) {
	return q.replace(/[%_]/g, "").trim();
}
/**
* Case-insensitive brand search across name and slug, sanitized against
* wildcard injection, de-duplicated, ordered so exact-prefix name matches first.
*/
async function searchBrands(query, limit = 8) {
	const q = sanitizeQuery(query);
	if (!q) return [];
	const { data: byName, error: nameErr } = await supabase.from("brands").select("*").ilike("name", `%${q}%`).order("trust_score", { ascending: false }).limit(limit);
	if (nameErr) throw nameErr;
	const { data: bySlug, error: slugErr } = await supabase.from("brands").select("*").ilike("slug", `%${q}%`).order("trust_score", { ascending: false }).limit(limit);
	if (slugErr) throw slugErr;
	const seen = /* @__PURE__ */ new Map();
	for (const row of [...byName ?? [], ...bySlug ?? []]) if (!seen.has(row.id)) seen.set(row.id, row);
	return decorate([...seen.values()].sort((a, b) => {
		const aPre = String(a.name).toLowerCase().startsWith(q.toLowerCase()) ? 0 : 1;
		const bPre = String(b.name).toLowerCase().startsWith(q.toLowerCase()) ? 0 : 1;
		if (aPre !== bPre) return aPre - bPre;
		return (Number(b.trust_score) || 0) - (Number(a.trust_score) || 0);
	}).slice(0, limit));
}
async function createBrand(input) {
	let logoPath = null;
	if (input.logo) {
		const ext = input.logo.name.split(".").pop() ?? "png";
		const path = `${input.ownerId}/brand-${crypto.randomUUID()}.${ext}`;
		const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, input.logo);
		if (upErr) throw upErr;
		logoPath = path;
	}
	const base = slugify(input.name) || "brand";
	let slug = base;
	for (let i = 0; i < 5; i++) {
		const { data: existing } = await supabase.from("brands").select("id").eq("slug", slug).maybeSingle();
		if (!existing) break;
		slug = `${base}-${Math.floor(Math.random() * 1e4)}`;
	}
	const { data, error } = await supabase.from("brands").insert({
		owner_id: input.ownerId,
		name: input.name.trim(),
		slug,
		description: input.description.trim() || null,
		website: input.website.trim() || null,
		category: input.category.trim() || null,
		logo_url: logoPath
	}).select("*").single();
	if (error) throw error;
	return (await decorate([data]))[0];
}
async function fetchMyVerificationRequest(brandId) {
	const { data, error } = await supabase.from("brand_verification_requests").select("*").eq("brand_id", brandId).order("created_at", { ascending: false }).limit(1).maybeSingle();
	if (error) throw error;
	return data;
}
async function requestVerification(input) {
	const { error } = await supabase.from("brand_verification_requests").insert({
		brand_id: input.brandId,
		requested_by: input.userId,
		message: input.message.trim() || null
	});
	if (error) throw error;
}
async function fetchPendingVerifications() {
	const { data, error } = await supabase.from("brand_verification_requests").select("*").eq("status", "pending").order("created_at", { ascending: true });
	if (error) throw error;
	const rows = data ?? [];
	if (!rows.length) return [];
	const brandIds = [...new Set(rows.map((r) => r.brand_id))];
	const { data: brands } = await supabase.from("brands").select("id, name, slug").in("id", brandIds);
	const byId = new Map((brands ?? []).map((b) => [b.id, b]));
	return rows.map((r) => ({
		...r,
		brandName: byId.get(r.brand_id)?.name ?? "Unknown",
		brandSlug: byId.get(r.brand_id)?.slug ?? ""
	}));
}
async function reviewVerification(input) {
	const { error } = await supabase.from("brand_verification_requests").update({
		status: input.approve ? "approved" : "rejected",
		reviewed_by: input.reviewerId
	}).eq("id", input.requestId);
	if (error) throw error;
	if (input.approve) {
		const { error: bErr } = await supabase.from("brands").update({ verified: true }).eq("id", input.brandId);
		if (bErr) throw bErr;
	}
}
async function fetchBrandStats(brandId) {
	const { data: items } = await supabase.from("items").select("id").eq("brand_id", brandId);
	const itemIds = (items ?? []).map((i) => i.id);
	if (itemIds.length === 0) return {
		posts: 0,
		stash: 0,
		trash: 0
	};
	const { data: votes } = await supabase.from("votes").select("verdict").in("item_id", itemIds);
	const stash = (votes ?? []).filter((v) => v.verdict === "stash").length;
	const trash = (votes ?? []).filter((v) => v.verdict === "trash").length;
	return {
		posts: itemIds.length,
		stash,
		trash
	};
}
/** Brands by id, decorated the same way as the other fetchers. */
async function fetchBrandsByIds(ids) {
	if (!ids.length) return [];
	const { data, error } = await supabase.from("brands").select("*").in("id", ids);
	if (error) throw error;
	return decorate(data ?? []);
}
/** Community verdict on the brand itself (direct brand votes + votes on its posts). */
async function fetchBrandVerdict(brandId, userId) {
	const [{ data, error }, mine] = await Promise.all([supabase.rpc("brand_verdict_summary", { _brand_id: brandId }), userId ? supabase.from("brand_votes").select("verdict").eq("brand_id", brandId).eq("user_id", userId).maybeSingle() : Promise.resolve({ data: null })]);
	if (error) throw error;
	const row = Array.isArray(data) ? data[0] : data;
	return {
		stash: row?.stash ?? 0,
		trash: row?.trash ?? 0,
		total: row?.total ?? 0,
		stash_pct: row?.stash_pct ?? 50,
		myVerdict: mine?.data?.verdict ?? null
	};
}
async function castBrandVote(brandId, userId, verdict) {
	const { error } = await supabase.from("brand_votes").upsert({
		brand_id: brandId,
		user_id: userId,
		verdict
	}, { onConflict: "brand_id,user_id" });
	if (error) throw error;
}
async function removeBrandVote(brandId, userId) {
	const { error } = await supabase.from("brand_votes").delete().eq("brand_id", brandId).eq("user_id", userId);
	if (error) throw error;
}
var _jsxFileName$9 = "/app/applet/src/components/ui/dialog.tsx";
var Dialog = Dialog$1;
var DialogTrigger = DialogTrigger$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$9,
	lineNumber: 21,
	columnNumber: 3
}, void 0));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogOverlay, {}, void 0, false, {
	fileName: _jsxFileName$9,
	lineNumber: 37,
	columnNumber: 5
}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(X, { className: "h-4 w-4" }, void 0, false, {
			fileName: _jsxFileName$9,
			lineNumber: 48,
			columnNumber: 9
		}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
			className: "sr-only",
			children: "Close"
		}, void 0, false, {
			fileName: _jsxFileName$9,
			lineNumber: 49,
			columnNumber: 9
		}, void 0)]
	}, void 0, true, {
		fileName: _jsxFileName$9,
		lineNumber: 47,
		columnNumber: 7
	}, void 0)]
}, void 0, true, {
	fileName: _jsxFileName$9,
	lineNumber: 38,
	columnNumber: 5
}, void 0)] }, void 0, true, {
	fileName: _jsxFileName$9,
	lineNumber: 36,
	columnNumber: 3
}, void 0));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$9,
	lineNumber: 57,
	columnNumber: 3
}, void 0);
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$9,
	lineNumber: 62,
	columnNumber: 3
}, void 0);
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$9,
	lineNumber: 73,
	columnNumber: 3
}, void 0));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$9,
	lineNumber: 85,
	columnNumber: 3
}, void 0));
DialogDescription.displayName = DialogDescription$1.displayName;
var _jsxFileName$8 = "/app/applet/src/components/ui/command.tsx";
var Command$1 = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(_e, {
	ref,
	className: cn("flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$8,
	lineNumber: 15,
	columnNumber: 3
}, void 0));
Command$1.displayName = _e.displayName;
var CommandInput = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
	className: "flex items-center border-b px-3",
	"cmdk-input-wrapper": "",
	children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Search, { className: "mr-2 h-4 w-4 shrink-0 opacity-50" }, void 0, false, {
		fileName: _jsxFileName$8,
		lineNumber: 43,
		columnNumber: 5
	}, void 0), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(_e.Input, {
		ref,
		className: cn("flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50", className),
		...props
	}, void 0, false, {
		fileName: _jsxFileName$8,
		lineNumber: 44,
		columnNumber: 5
	}, void 0)]
}, void 0, true, {
	fileName: _jsxFileName$8,
	lineNumber: 42,
	columnNumber: 3
}, void 0));
CommandInput.displayName = _e.Input.displayName;
var CommandList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(_e.List, {
	ref,
	className: cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$8,
	lineNumber: 61,
	columnNumber: 3
}, void 0));
CommandList.displayName = _e.List.displayName;
var CommandEmpty = import_react.forwardRef((props, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(_e.Empty, {
	ref,
	className: "py-6 text-center text-sm",
	...props
}, void 0, false, {
	fileName: _jsxFileName$8,
	lineNumber: 74,
	columnNumber: 3
}, void 0));
CommandEmpty.displayName = _e.Empty.displayName;
var CommandGroup = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(_e.Group, {
	ref,
	className: cn("overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$8,
	lineNumber: 83,
	columnNumber: 3
}, void 0));
CommandGroup.displayName = _e.Group.displayName;
var CommandSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(_e.Separator, {
	ref,
	className: cn("-mx-1 h-px bg-border", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$8,
	lineNumber: 99,
	columnNumber: 3
}, void 0));
CommandSeparator.displayName = _e.Separator.displayName;
var CommandItem = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(_e.Item, {
	ref,
	className: cn("relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$8,
	lineNumber: 111,
	columnNumber: 3
}, void 0));
CommandItem.displayName = _e.Item.displayName;
var CommandShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
		className: cn("ml-auto text-xs tracking-widest text-muted-foreground", className),
		...props
	}, void 0, false, {
		fileName: _jsxFileName$8,
		lineNumber: 125,
		columnNumber: 5
	}, void 0);
};
CommandShortcut.displayName = "CommandShortcut";
var _jsxFileName$7 = "/app/applet/src/components/ui/popover.tsx";
var Popover = Root2$1;
var PopoverTrigger = Trigger$1;
var PopoverContent = import_react.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Portal, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Content2$1, {
	ref,
	align,
	sideOffset,
	className: cn("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$7,
	lineNumber: 17,
	columnNumber: 5
}, void 0) }, void 0, false, {
	fileName: _jsxFileName$7,
	lineNumber: 16,
	columnNumber: 3
}, void 0));
PopoverContent.displayName = Content2$1.displayName;
var _jsxFileName$6 = "/app/applet/src/components/BrandSearch.tsx";
function BrandSearch({ onSelectBrand, selectedId, placeholder, className }) {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [query, setQuery] = (0, import_react.useState)("");
	const { data: results } = useQuery({
		queryKey: ["brand-search", query],
		queryFn: () => searchBrands(query),
		enabled: open && query.trim().length > 0
	});
	(0, import_react.useEffect)(() => {
		if (selectedId) setOpen(false);
	}, [selectedId]);
	const q = query.trim();
	const handleSelect = (brand) => {
		setOpen(false);
		setQuery("");
		if (onSelectBrand) onSelectBrand(brand);
		else navigate({
			to: "/brands/$slug",
			params: { slug: brand.slug }
		});
	};
	const addNew = () => {
		setOpen(false);
		setQuery("");
		navigate({
			to: "/brands/new",
			search: { name: q }
		});
	};
	const exactMatch = (results ?? []).some((b) => b.name.toLowerCase() === q.toLowerCase());
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Popover, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PopoverTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
				variant: "outline",
				role: "combobox",
				"aria-expanded": open,
				className: cn("w-full justify-start", className),
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Search, { className: "h-4 w-4 shrink-0 opacity-60" }, void 0, false, {
					fileName: _jsxFileName$6,
					lineNumber: 72,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "truncate text-muted-foreground",
					children: placeholder ?? t("brand.searchPlaceholder")
				}, void 0, false, {
					fileName: _jsxFileName$6,
					lineNumber: 73,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$6,
				lineNumber: 66,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName$6,
			lineNumber: 65,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PopoverContent, {
			align: "start",
			className: "w-80 max-w-[90vw] p-0",
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Command$1, {
				shouldFilter: false,
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CommandInput, {
					value: query,
					onValueChange: setQuery,
					placeholder: placeholder ?? t("brand.searchPlaceholder")
				}, void 0, false, {
					fileName: _jsxFileName$6,
					lineNumber: 80,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CommandList, { children: [
					results && results.length === 0 && /* @__PURE__ */ (void 0)("div", {
						className: "px-3 py-6 text-center text-sm text-muted-foreground",
						children: t("brand.searchNoResults")
					}, void 0, false, {
						fileName: _jsxFileName$6,
						lineNumber: 87,
						columnNumber: 15
					}, this),
					results && results.length > 0 && /* @__PURE__ */ (void 0)(CommandGroup, {
						heading: t("brand.searchResults"),
						children: results.map((b) => /* @__PURE__ */ (void 0)(CommandItem, {
							value: b.id,
							onSelect: () => handleSelect(b),
							children: [
								/* @__PURE__ */ (void 0)(Check, { className: cn("mr-2 h-4 w-4", selectedId === b.id ? "opacity-100" : "opacity-0") }, void 0, false, {
									fileName: _jsxFileName$6,
									lineNumber: 95,
									columnNumber: 21
								}, this),
								/* @__PURE__ */ (void 0)("span", {
									className: "truncate",
									children: b.name
								}, void 0, false, {
									fileName: _jsxFileName$6,
									lineNumber: 101,
									columnNumber: 21
								}, this),
								b.country && /* @__PURE__ */ (void 0)("span", {
									className: "ml-auto shrink-0 pl-2 text-xs text-muted-foreground",
									children: b.country
								}, void 0, false, {
									fileName: _jsxFileName$6,
									lineNumber: 103,
									columnNumber: 23
								}, this)
							]
						}, b.id, true, {
							fileName: _jsxFileName$6,
							lineNumber: 94,
							columnNumber: 19
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName$6,
						lineNumber: 92,
						columnNumber: 15
					}, this),
					q.length > 0 && !exactMatch && /* @__PURE__ */ (void 0)(CommandGroup, { children: /* @__PURE__ */ (void 0)(CommandItem, {
						value: "__add_new_brand__",
						onSelect: addNew,
						children: [/* @__PURE__ */ (void 0)(Plus, { className: "mr-2 h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName$6,
							lineNumber: 114,
							columnNumber: 19
						}, this), t("brand.addNew", { name: q })]
					}, void 0, true, {
						fileName: _jsxFileName$6,
						lineNumber: 113,
						columnNumber: 17
					}, this) }, void 0, false, {
						fileName: _jsxFileName$6,
						lineNumber: 112,
						columnNumber: 15
					}, this)
				] }, void 0, true, {
					fileName: _jsxFileName$6,
					lineNumber: 85,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$6,
				lineNumber: 79,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName$6,
			lineNumber: 78,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$6,
		lineNumber: 64,
		columnNumber: 5
	}, this);
}
var _jsxFileName$5 = "/app/applet/src/components/ui/textarea.tsx";
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	}, void 0, false, {
		fileName: _jsxFileName$5,
		lineNumber: 8,
		columnNumber: 7
	}, void 0);
});
Textarea.displayName = "Textarea";
var icon_coin_default = "/assets/icon-coin-PeqkN9T-.png";
var icon_bin_default = "/assets/icon-bin-CzHXY9rc.png";
var coinDropAudio = null;
var trashLidAudio = null;
function playAudio(path, current) {
	if (typeof window === "undefined") return;
	const audio = current === "coin" ? coinDropAudio ??= new Audio(path) : trashLidAudio ??= new Audio(path);
	audio.currentTime = 0;
	audio.play().catch(() => void 0);
}
function playStashSound() {
	playAudio("/audio/coin-drop.mp3", "coin");
}
function playTrashSound() {
	if (typeof window === "undefined") return;
	try {
		const AudioCtx = window.AudioContext || window.webkitAudioContext;
		if (!AudioCtx) {
			playAudio("/audio/trash-lid-close.mp3", "trash");
			return;
		}
		const ctx = new AudioCtx();
		const now = ctx.currentTime;
		const hingeOsc = ctx.createOscillator();
		const hingeGain = ctx.createGain();
		hingeOsc.type = "sawtooth";
		hingeOsc.frequency.setValueAtTime(320, now);
		hingeOsc.frequency.exponentialRampToValueAtTime(700, now + .14);
		hingeGain.gain.setValueAtTime(.05, now);
		hingeGain.gain.exponentialRampToValueAtTime(.001, now + .16);
		hingeOsc.connect(hingeGain);
		hingeGain.connect(ctx.destination);
		hingeOsc.start(now);
		hingeOsc.stop(now + .16);
		const chomp1 = ctx.createOscillator();
		const chomp1Gain = ctx.createGain();
		chomp1.type = "square";
		chomp1.frequency.setValueAtTime(400, now + .32);
		chomp1.frequency.exponentialRampToValueAtTime(80, now + .42);
		chomp1Gain.gain.setValueAtTime(.25, now + .32);
		chomp1Gain.gain.exponentialRampToValueAtTime(.001, now + .44);
		chomp1.connect(chomp1Gain);
		chomp1Gain.connect(ctx.destination);
		chomp1.start(now + .32);
		chomp1.stop(now + .44);
		const chomp2 = ctx.createOscillator();
		const chomp2Gain = ctx.createGain();
		chomp2.type = "triangle";
		chomp2.frequency.setValueAtTime(540, now + .54);
		chomp2.frequency.exponentialRampToValueAtTime(110, now + .65);
		chomp2Gain.gain.setValueAtTime(.22, now + .54);
		chomp2Gain.gain.exponentialRampToValueAtTime(.001, now + .68);
		chomp2.connect(chomp2Gain);
		chomp2Gain.connect(ctx.destination);
		chomp2.start(now + .54);
		chomp2.stop(now + .68);
		const chomp3 = ctx.createOscillator();
		const chomp3Gain = ctx.createGain();
		chomp3.type = "square";
		chomp3.frequency.setValueAtTime(580, now + .78);
		chomp3.frequency.exponentialRampToValueAtTime(65, now + .94);
		chomp3Gain.gain.setValueAtTime(.3, now + .78);
		chomp3Gain.gain.exponentialRampToValueAtTime(.001, now + .96);
		chomp3.connect(chomp3Gain);
		chomp3Gain.connect(ctx.destination);
		chomp3.start(now + .78);
		chomp3.stop(now + .96);
		const canRing = ctx.createOscillator();
		const canRingGain = ctx.createGain();
		canRing.type = "sine";
		canRing.frequency.setValueAtTime(1200, now + .78);
		canRing.frequency.exponentialRampToValueAtTime(320, now + 1.12);
		canRingGain.gain.setValueAtTime(.14, now + .78);
		canRingGain.gain.exponentialRampToValueAtTime(.001, now + 1.15);
		canRing.connect(canRingGain);
		canRingGain.connect(ctx.destination);
		canRing.start(now + .78);
		canRing.stop(now + 1.15);
	} catch {
		playAudio("/audio/trash-lid-close.mp3", "trash");
	}
}
function playCoinSpinSound() {
	if (typeof window === "undefined") return;
	try {
		const AudioCtx = window.AudioContext || window.webkitAudioContext;
		if (!AudioCtx) {
			playStashSound();
			return;
		}
		const ctx = new AudioCtx();
		const now = ctx.currentTime;
		const flickOsc = ctx.createOscillator();
		const flickGain = ctx.createGain();
		flickOsc.type = "sine";
		flickOsc.frequency.setValueAtTime(3600, now);
		flickOsc.frequency.exponentialRampToValueAtTime(1400, now + .1);
		flickGain.gain.setValueAtTime(.3, now);
		flickGain.gain.exponentialRampToValueAtTime(.001, now + .13);
		flickOsc.connect(flickGain);
		flickGain.connect(ctx.destination);
		flickOsc.start(now);
		flickOsc.stop(now + .13);
		const spinHum = ctx.createOscillator();
		const spinHumGain = ctx.createGain();
		spinHum.type = "triangle";
		spinHum.frequency.setValueAtTime(780, now + .08);
		spinHum.frequency.linearRampToValueAtTime(540, now + 1.3);
		spinHumGain.gain.setValueAtTime(.001, now);
		spinHumGain.gain.linearRampToValueAtTime(.09, now + .2);
		spinHumGain.gain.linearRampToValueAtTime(.07, now + 1.2);
		spinHumGain.gain.exponentialRampToValueAtTime(.001, now + 1.5);
		spinHum.connect(spinHumGain);
		spinHumGain.connect(ctx.destination);
		spinHum.start(now + .08);
		spinHum.stop(now + 1.5);
		const eulerOsc = ctx.createOscillator();
		const eulerGain = ctx.createGain();
		eulerOsc.type = "sawtooth";
		eulerOsc.frequency.setValueAtTime(24, now + 1);
		eulerOsc.frequency.exponentialRampToValueAtTime(320, now + 2.65);
		eulerGain.gain.setValueAtTime(.001, now);
		eulerGain.gain.setValueAtTime(.02, now + 1);
		eulerGain.gain.linearRampToValueAtTime(.19, now + 2.5);
		eulerGain.gain.exponentialRampToValueAtTime(.001, now + 2.75);
		eulerOsc.connect(eulerGain);
		eulerGain.connect(ctx.destination);
		eulerOsc.start(now + 1);
		eulerOsc.stop(now + 2.75);
		const flatSlap = ctx.createOscillator();
		const slapGain = ctx.createGain();
		flatSlap.type = "square";
		flatSlap.frequency.setValueAtTime(580, now + 2.7);
		flatSlap.frequency.exponentialRampToValueAtTime(90, now + 2.88);
		slapGain.gain.setValueAtTime(.26, now + 2.7);
		slapGain.gain.exponentialRampToValueAtTime(.001, now + 2.92);
		flatSlap.connect(slapGain);
		slapGain.connect(ctx.destination);
		flatSlap.start(now + 2.7);
		flatSlap.stop(now + 2.92);
	} catch {
		playStashSound();
	}
}
var _jsxFileName$4 = "/app/applet/src/components/SubmitDialog.tsx";
var NO_BRAND = "__none__";
var FEEDBACK_TYPES = [
	"Concern",
	"Compliment",
	"Idea",
	"Question"
];
function SubmitDialog({ onPosted, defaultBrandId }) {
	const { user } = useAuth();
	const { t } = useTranslation();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [title, setTitle] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("");
	const [brandId, setBrandId] = (0, import_react.useState)(defaultBrandId ?? NO_BRAND);
	const [file, setFile] = (0, import_react.useState)(null);
	const [verdict, setVerdict] = (0, import_react.useState)(null);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const reset = () => {
		setTitle("");
		setDescription("");
		setCategory("");
		setBrandId(defaultBrandId ?? NO_BRAND);
		setFile(null);
		setVerdict(null);
	};
	const handleSubmit = async () => {
		if (!user) return;
		if (!title.trim()) {
			toast.error(t("submit.needTitle"));
			return;
		}
		if (!verdict) {
			toast.error(t("submit.needVerdict"));
			return;
		}
		setSubmitting(true);
		try {
			await createItem({
				userId: user.id,
				title,
				description,
				file,
				brandId: brandId === NO_BRAND ? null : brandId,
				category,
				verdict
			});
			toast.success(t("submit.posted"));
			reset();
			setOpen(false);
			onPosted?.();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : t("submit.error"));
		} finally {
			setSubmitting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
				size: "sm",
				className: "gap-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "h-4 w-4" }, void 0, false, {
						fileName: _jsxFileName$4,
						lineNumber: 93,
						columnNumber: 11
					}, this),
					" ",
					t("submit.trigger")
				]
			}, void 0, true, {
				fileName: _jsxFileName$4,
				lineNumber: 92,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName$4,
			lineNumber: 91,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, {
				className: "font-display text-2xl",
				children: t("submit.title")
			}, void 0, false, {
				fileName: _jsxFileName$4,
				lineNumber: 98,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogDescription, { children: t("submit.intro") }, void 0, false, {
				fileName: _jsxFileName$4,
				lineNumber: 99,
				columnNumber: 11
			}, this)] }, void 0, true, {
				fileName: _jsxFileName$4,
				lineNumber: 97,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "space-y-4 py-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
							htmlFor: "title",
							children: t("submit.fieldTitle")
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 104,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
							id: "title",
							value: title,
							onChange: (e) => setTitle(e.target.value),
							placeholder: t("submit.titlePh"),
							maxLength: 120
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 105,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$4,
						lineNumber: 103,
						columnNumber: 11
					}, this),
					!defaultBrandId && /* @__PURE__ */ (void 0)("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (void 0)(Label, { children: t("submit.brand") }, void 0, false, {
								fileName: _jsxFileName$4,
								lineNumber: 116,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)(BrandSearch, {
								onSelectBrand: (b) => setBrandId(b.id),
								selectedId: brandId === NO_BRAND ? void 0 : brandId,
								placeholder: t("submit.brandPh")
							}, void 0, false, {
								fileName: _jsxFileName$4,
								lineNumber: 117,
								columnNumber: 15
							}, this),
							brandId !== NO_BRAND && /* @__PURE__ */ (void 0)(Button, {
								type: "button",
								variant: "ghost",
								size: "sm",
								className: "h-8 px-2",
								onClick: () => setBrandId(NO_BRAND),
								children: t("submit.noBrand")
							}, void 0, false, {
								fileName: _jsxFileName$4,
								lineNumber: 123,
								columnNumber: 17
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$4,
						lineNumber: 115,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: t("submit.verdict") }, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 137,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								type: "button",
								variant: "stash",
								size: "lg",
								onClick: () => {
									playStashSound();
									setVerdict("stash");
								},
								className: cn("gap-2", verdict === "stash" && "verdict-picked", verdict === "trash" && "verdict-dimmed"),
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
										src: icon_coin_default,
										alt: "",
										"aria-hidden": true,
										className: "verdict-icon"
									}, void 0, false, {
										fileName: _jsxFileName$4,
										lineNumber: 153,
										columnNumber: 17
									}, this),
									" ",
									t("vote.stash")
								]
							}, void 0, true, {
								fileName: _jsxFileName$4,
								lineNumber: 139,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								type: "button",
								variant: "trash",
								size: "lg",
								onClick: () => {
									playTrashSound();
									setVerdict("trash");
								},
								className: cn("gap-2", verdict === "trash" && "verdict-picked", verdict === "stash" && "verdict-dimmed"),
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
										src: icon_bin_default,
										alt: "",
										"aria-hidden": true,
										className: "verdict-icon"
									}, void 0, false, {
										fileName: _jsxFileName$4,
										lineNumber: 169,
										columnNumber: 17
									}, this),
									" ",
									t("vote.trash")
								]
							}, void 0, true, {
								fileName: _jsxFileName$4,
								lineNumber: 155,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$4,
							lineNumber: 138,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$4,
						lineNumber: 136,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
								htmlFor: "category",
								children: "What kind of feedback is this?"
							}, void 0, false, {
								fileName: _jsxFileName$4,
								lineNumber: 175,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "grid grid-cols-2 gap-2 sm:grid-cols-4",
								children: FEEDBACK_TYPES.map((type) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									type: "button",
									variant: category === type ? "default" : "outline",
									size: "sm",
									onClick: () => setCategory(type),
									children: type
								}, type, false, {
									fileName: _jsxFileName$4,
									lineNumber: 178,
									columnNumber: 17
								}, this))
							}, void 0, false, {
								fileName: _jsxFileName$4,
								lineNumber: 176,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
								id: "category",
								value: category,
								onChange: (e) => setCategory(e.target.value),
								placeholder: "Add a more specific topic, if useful",
								maxLength: 40
							}, void 0, false, {
								fileName: _jsxFileName$4,
								lineNumber: 189,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$4,
						lineNumber: 174,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
							htmlFor: "desc",
							children: t("submit.description")
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 199,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Textarea, {
							id: "desc",
							value: description,
							onChange: (e) => setDescription(e.target.value),
							placeholder: t("submit.descriptionPh"),
							rows: 3,
							maxLength: 500
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 200,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$4,
						lineNumber: 198,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
								htmlFor: "file",
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ImagePlus, { className: "h-4 w-4" }, void 0, false, {
										fileName: _jsxFileName$4,
										lineNumber: 211,
										columnNumber: 15
									}, this),
									" ",
									t("submit.photo")
								]
							}, void 0, true, {
								fileName: _jsxFileName$4,
								lineNumber: 210,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
								id: "file",
								type: "file",
								accept: "image/*",
								onChange: (e) => setFile(e.target.files?.[0] ?? null)
							}, void 0, false, {
								fileName: _jsxFileName$4,
								lineNumber: 213,
								columnNumber: 13
							}, this),
							file && /* @__PURE__ */ (void 0)("p", {
								className: "text-xs text-muted-foreground",
								children: file.name
							}, void 0, false, {
								fileName: _jsxFileName$4,
								lineNumber: 219,
								columnNumber: 22
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$4,
						lineNumber: 209,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName$4,
				lineNumber: 102,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
				onClick: handleSubmit,
				disabled: submitting,
				className: "w-full",
				children: submitting ? t("submit.posting") : t("submit.submit")
			}, void 0, false, {
				fileName: _jsxFileName$4,
				lineNumber: 224,
				columnNumber: 11
			}, this) }, void 0, false, {
				fileName: _jsxFileName$4,
				lineNumber: 223,
				columnNumber: 9
			}, this)
		] }, void 0, true, {
			fileName: _jsxFileName$4,
			lineNumber: 96,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$4,
		lineNumber: 90,
		columnNumber: 5
	}, this);
}
var _jsxFileName$3 = "/app/applet/src/components/ui/dropdown-menu.tsx";
var DropdownMenu = Root2;
var DropdownMenuTrigger = Trigger;
var DropdownMenuSubTrigger = import_react.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SubTrigger2, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChevronRight, { className: "ml-auto" }, void 0, false, {
		fileName: _jsxFileName$3,
		lineNumber: 37,
		columnNumber: 5
	}, void 0)]
}, void 0, true, {
	fileName: _jsxFileName$3,
	lineNumber: 27,
	columnNumber: 3
}, void 0));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
var DropdownMenuSubContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SubContent2, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$3,
	lineNumber: 46,
	columnNumber: 3
}, void 0));
DropdownMenuSubContent.displayName = SubContent2.displayName;
var DropdownMenuContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$3,
	lineNumber: 62,
	columnNumber: 5
}, void 0) }, void 0, false, {
	fileName: _jsxFileName$3,
	lineNumber: 61,
	columnNumber: 3
}, void 0));
DropdownMenuContent.displayName = Content2.displayName;
var DropdownMenuItem = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Item2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$3,
	lineNumber: 82,
	columnNumber: 3
}, void 0));
DropdownMenuItem.displayName = Item2.displayName;
var DropdownMenuCheckboxItem = import_react.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CheckboxItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	checked,
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Check, { className: "h-4 w-4" }, void 0, false, {
			fileName: _jsxFileName$3,
			lineNumber: 109,
			columnNumber: 9
		}, void 0) }, void 0, false, {
			fileName: _jsxFileName$3,
			lineNumber: 108,
			columnNumber: 7
		}, void 0)
	}, void 0, false, {
		fileName: _jsxFileName$3,
		lineNumber: 107,
		columnNumber: 5
	}, void 0), children]
}, void 0, true, {
	fileName: _jsxFileName$3,
	lineNumber: 98,
	columnNumber: 3
}, void 0));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
var DropdownMenuRadioItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(RadioItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Circle, { className: "h-2 w-2 fill-current" }, void 0, false, {
			fileName: _jsxFileName$3,
			lineNumber: 131,
			columnNumber: 9
		}, void 0) }, void 0, false, {
			fileName: _jsxFileName$3,
			lineNumber: 130,
			columnNumber: 7
		}, void 0)
	}, void 0, false, {
		fileName: _jsxFileName$3,
		lineNumber: 129,
		columnNumber: 5
	}, void 0), children]
}, void 0, true, {
	fileName: _jsxFileName$3,
	lineNumber: 121,
	columnNumber: 3
}, void 0));
DropdownMenuRadioItem.displayName = RadioItem2.displayName;
var DropdownMenuLabel = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label2, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$3,
	lineNumber: 145,
	columnNumber: 3
}, void 0));
DropdownMenuLabel.displayName = Label2.displayName;
var DropdownMenuSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Separator2, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}, void 0, false, {
	fileName: _jsxFileName$3,
	lineNumber: 157,
	columnNumber: 3
}, void 0));
DropdownMenuSeparator.displayName = Separator2.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	}, void 0, false, {
		fileName: _jsxFileName$3,
		lineNumber: 167,
		columnNumber: 5
	}, void 0);
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
var _jsxFileName$2 = "/app/applet/src/components/LanguageSwitcher.tsx";
function LanguageSwitcher() {
	const { i18n } = useTranslation();
	const [query, setQuery] = (0, import_react.useState)("");
	const current = LANGUAGES.find((l) => l.code === i18n.language || l.code === i18n.language.split("-")[0]) ?? LANGUAGES[0];
	const filteredLanguages = (0, import_react.useMemo)(() => {
		const normalized = query.trim().toLowerCase();
		if (!normalized) return LANGUAGES;
		return LANGUAGES.filter((language) => `${language.label} ${language.native ?? ""} ${language.code}`.toLowerCase().includes(normalized));
	}, [query]);
	const change = async (code) => {
		await i18n.changeLanguage(code);
		if (typeof window !== "undefined") window.localStorage.setItem("sot-lang", code);
		if (typeof document !== "undefined") {
			document.documentElement.lang = code;
			document.documentElement.dir = RTL_LANGUAGES.includes(code) ? "rtl" : "ltr";
		}
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DropdownMenuTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
			variant: "ghost",
			size: "sm",
			className: "gap-1.5",
			"aria-label": "Change language",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Globe, { className: "h-4 w-4" }, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 42,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "hidden sm:inline",
					children: current.label
				}, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 43,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "sr-only",
					children: [LANGUAGES.length, " languages available"]
				}, void 0, true, {
					fileName: _jsxFileName$2,
					lineNumber: 44,
					columnNumber: 11
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$2,
			lineNumber: 41,
			columnNumber: 9
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName$2,
		lineNumber: 40,
		columnNumber: 7
	}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DropdownMenuContent, {
		align: "end",
		className: "w-64 p-2",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "border-b border-border px-2 pb-2",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
				value: query,
				onChange: (event) => setQuery(event.target.value),
				placeholder: "Search languages",
				"aria-label": "Search languages",
				className: "h-8 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 49,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "mt-1 text-[11px] text-muted-foreground",
				children: [LANGUAGES.length, " launch languages"]
			}, void 0, true, {
				fileName: _jsxFileName$2,
				lineNumber: 56,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName$2,
			lineNumber: 48,
			columnNumber: 9
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-h-72 overflow-y-auto pt-1",
			children: [filteredLanguages.map((l) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DropdownMenuItem, {
				onClick: () => change(l.code),
				className: l.code === current.code ? "font-semibold text-primary" : "justify-between",
				dir: RTL_LANGUAGES.includes(l.code) ? "rtl" : "ltr",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: l.native ?? l.label }, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 68,
					columnNumber: 15
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "text-xs text-muted-foreground",
					children: l.code
				}, void 0, false, {
					fileName: _jsxFileName$2,
					lineNumber: 69,
					columnNumber: 15
				}, this)]
			}, l.code, true, {
				fileName: _jsxFileName$2,
				lineNumber: 62,
				columnNumber: 13
			}, this)), filteredLanguages.length === 0 && /* @__PURE__ */ (void 0)("p", {
				className: "px-2 py-3 text-sm text-muted-foreground",
				children: "No matching language."
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 73,
				columnNumber: 13
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName$2,
			lineNumber: 60,
			columnNumber: 9
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$2,
		lineNumber: 47,
		columnNumber: 7
	}, this)] }, void 0, true, {
		fileName: _jsxFileName$2,
		lineNumber: 39,
		columnNumber: 5
	}, this);
}
var _jsxFileName$1 = "/app/applet/src/components/SotWordmark.tsx";
/**
* The SOT brand wordmark. The capitals S · O · T are always emphasised so the
* eye reads the acronym "SOT" out of "Stash Or Trash" — building instant brand
* recall. Never render these letters in lowercase.
*/
function SotWordmark({ className, size = "md" }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
		"aria-label": "Stash Or Trash",
		className: cn("font-display font-extrabold tracking-tight text-foreground", size === "lg" ? "text-lg" : size === "sm" ? "text-sm" : "text-base", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				className: "text-stash",
				children: "S"
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 26,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "tash " }, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 27,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				className: "text-foreground",
				children: "O"
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 28,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "r " }, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 29,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				className: "text-trash",
				children: "T"
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 30,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "rash" }, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 31,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 18,
		columnNumber: 5
	}, this);
}
var _jsxFileName = "/app/applet/src/components/Header.tsx";
function Header({ onPosted }) {
	const { user, loading, signOut } = useAuth();
	const { isAdmin, isBrand } = useRoles();
	const { t } = useTranslation();
	const navigate = useNavigate();
	const unread = useUnreadCount(user?.id);
	const unreadNotifs = useUnreadNotifications(user?.id);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", {
		suppressHydrationWarning: true,
		className: "sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "mx-auto flex h-16 max-w-5xl items-center justify-between px-4",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex items-center gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
					to: "/",
					className: "group flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						"aria-label": "SOrT — Stash Or Trash logo",
						className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-foreground text-sm font-extrabold tracking-[-0.12em] text-background shadow-sm transition-transform group-hover:scale-110 group-hover:rotate-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-stash",
								children: "S"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 33,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "O" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 34,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-trash",
								children: "r"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 35,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "T" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 36,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 29,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "hidden sm:inline",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SotWordmark, { className: "text-xl" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 39,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 38,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 28,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", {
					className: "flex items-center gap-1 text-sm font-medium",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
							to: "/",
							className: "rounded-md px-2 py-1 text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground",
							children: "Home"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 43,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
							to: "/feed",
							className: "rounded-md px-2 py-1 text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground",
							children: t("nav.feed")
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 49,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
							to: "/brands",
							className: "rounded-md px-2 py-1 text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground",
							children: t("nav.brands")
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 55,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
							to: "/awards",
							className: "rounded-md px-2 py-1 text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground",
							children: t("nav.awards")
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 61,
							columnNumber: 13
						}, this),
						user && (isBrand || isAdmin) && /* @__PURE__ */ (void 0)(Link, {
							to: "/dashboard",
							className: "rounded-md px-2 py-1 text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground",
							children: t("nav.dashboard")
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 68,
							columnNumber: 15
						}, this),
						user && /* @__PURE__ */ (void 0)(Link, {
							to: "/profile",
							className: "rounded-md px-2 py-1 text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground",
							children: t("nav.profile")
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 76,
							columnNumber: 15
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 42,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 27,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex items-center gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LanguageSwitcher, {}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 87,
					columnNumber: 11
				}, this), loading ? null : user ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
					isAdmin && /* @__PURE__ */ (void 0)(Button, {
						variant: "ghost",
						size: "icon",
						onClick: () => navigate({ to: "/admin" }),
						"aria-label": t("nav.admin"),
						children: /* @__PURE__ */ (void 0)(Shield, { className: "h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 97,
							columnNumber: 19
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 91,
						columnNumber: 17
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						variant: "ghost",
						size: "icon",
						className: "relative",
						onClick: () => navigate({ to: "/notifications" }),
						"aria-label": t("social.notifications"),
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Bell, { className: "h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 107,
							columnNumber: 17
						}, this), unreadNotifs > 0 && /* @__PURE__ */ (void 0)("span", {
							className: "absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-trash px-1 text-[10px] font-bold text-trash-foreground",
							children: unreadNotifs > 99 ? "99+" : unreadNotifs
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 109,
							columnNumber: 19
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 100,
						columnNumber: 15
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						variant: "ghost",
						size: "icon",
						className: "relative",
						onClick: () => navigate({ to: "/messages" }),
						"aria-label": t("nav.messages"),
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MessageCircle, { className: "h-4 w-4" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 121,
							columnNumber: 17
						}, this), unread > 0 && /* @__PURE__ */ (void 0)("span", {
							className: "absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-trash px-1 text-[10px] font-bold text-white",
							children: unread > 99 ? "99+" : unread
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 123,
							columnNumber: 19
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 114,
						columnNumber: 15
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SubmitDialog, { onPosted }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 128,
						columnNumber: 15
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => signOut(),
						children: t("nav.signOut")
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 129,
						columnNumber: 15
					}, this)
				] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 89,
					columnNumber: 13
				}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					size: "sm",
					onClick: () => navigate({ to: "/auth" }),
					children: t("nav.signIn")
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 134,
					columnNumber: 13
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 86,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 26,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 22,
		columnNumber: 5
	}, this);
}
//#endregion
export { playTrashSound as A, fetchMyVerificationRequest as C, icon_coin_default as D, icon_bin_default as E, searchBrands as F, useRoles as I, removeVote as M, requestVerification as N, playCoinSpinSound as O, reviewVerification as P, fetchMyBrands as S, fetchUserItems as T, fetchBrandVerdict as _, DialogHeader as a, fetchFeed as b, Header as c, castBrandVote as d, castVote as f, fetchBrandStats as g, fetchBrandBySlug as h, DialogFooter as i, removeBrandVote as j, playStashSound as k, SubmitDialog as l, deleteItem as m, DialogContent as n, DialogTitle as o, createBrand as p, DialogDescription as r, DialogTrigger as s, Dialog as t, Textarea as u, fetchBrands as v, fetchPendingVerifications as w, fetchItem as x, fetchBrandsByIds as y };
