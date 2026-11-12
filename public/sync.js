// Server mode: login, accounts and sync. Replaces the app's local storage (Store.write).
Object.assign(DE, {"Error": "Fehler", "Welcome! Create the admin account for this server.": "Willkommen! Erstelle das Admin-Konto für diesen Server.", "Create a new account": "Neues Konto erstellen", "Sign in to continue": "Melde dich an", "Username": "Benutzername", "Password": "Passwort", "Create account": "Konto erstellen", "Sign in": "Anmelden", "Back to sign in": "Zurück zur Anmeldung", "Import the local data from this browser into your account?": "Lokale Daten aus diesem Browser in dein Konto übernehmen?", "Account": "Konto", "Manage users": "Benutzer verwalten", "Change password": "Passwort ändern", "Sign out": "Abmelden", "Users": "Benutzer", "Admin": "Admin", "New user": "Neuer Benutzer", "Password (min. 6 characters)": "Passwort (mind. 6 Zeichen)", "Add": "Anlegen", "Current password": "Aktuelles Passwort", "New password": "Neues Passwort", "User created.": "Benutzer angelegt.", "Password changed.": "Passwort geändert.", "User deleted.": "Benutzer gelöscht.", "New password (min. 6 characters):": "Neues Passwort (mind. 6 Zeichen):", "Delete user “{n}” and all their data?": "Benutzer „{n}“ samt allen Daten löschen?", "Name: 2-32 characters (letters, numbers, _ . -)": "Name: 2-32 Zeichen (Buchstaben, Zahlen, _ . -)", "Password: at least 6 characters": "Passwort: mindestens 6 Zeichen", "That name is already taken": "Dieser Name ist schon vergeben", "Not signed in": "Nicht angemeldet", "Admins only": "Nur für Admins", "Too many attempts. Please wait 15 minutes.": "Zu viele Versuche. Bitte warte 15 Minuten.", "Payload too large": "Daten zu groß", "Invalid JSON": "Ungültiges JSON", "Registration is disabled. Ask the admin for an account.": "Registrierung ist deaktiviert. Frag den Admin nach einem Konto.", "Wrong name or password": "Name oder Passwort falsch", "Current password is wrong": "Aktuelles Passwort ist falsch", "Missing state": "Daten fehlen", "You cannot delete yourself": "Du kannst dich nicht selbst löschen", "Not found": "Nicht gefunden", "Server error": "Serverfehler"});
// Translations for the other languages (German is the Object.assign line above)
const SYNC_TR={"fr": {"Error": "Erreur", "Welcome! Create the admin account for this server.": "Bienvenue ! Crée le compte administrateur de ce serveur.", "Create a new account": "Créer un nouveau compte", "Sign in to continue": "Connecte-toi pour continuer", "Username": "Nom d'utilisateur", "Password": "Mot de passe", "Create account": "Créer le compte", "Sign in": "Se connecter", "Back to sign in": "Retour à la connexion", "Import the local data from this browser into your account?": "Importer les données locales de ce navigateur dans ton compte ?", "Account": "Compte", "Manage users": "Gérer les utilisateurs", "Change password": "Changer le mot de passe", "Sign out": "Se déconnecter", "Users": "Utilisateurs", "Admin": "Admin", "New user": "Nouvel utilisateur", "Password (min. 6 characters)": "Mot de passe (6 caractères min.)", "Add": "Ajouter", "Current password": "Mot de passe actuel", "New password": "Nouveau mot de passe", "User created.": "Utilisateur créé.", "Password changed.": "Mot de passe modifié.", "User deleted.": "Utilisateur supprimé.", "New password (min. 6 characters):": "Nouveau mot de passe (6 caractères min.) :", "Delete user “{n}” and all their data?": "Supprimer l'utilisateur « {n} » et toutes ses données ?", "Name: 2-32 characters (letters, numbers, _ . -)": "Nom : 2 à 32 caractères (lettres, chiffres, _ . -)", "Password: at least 6 characters": "Mot de passe : au moins 6 caractères", "That name is already taken": "Ce nom est déjà pris", "Not signed in": "Non connecté", "Admins only": "Réservé aux administrateurs", "Too many attempts. Please wait 15 minutes.": "Trop de tentatives. Patiente 15 minutes.", "Payload too large": "Données trop volumineuses", "Invalid JSON": "JSON invalide", "Registration is disabled. Ask the admin for an account.": "L'inscription est désactivée. Demande un compte à l'administrateur.", "Wrong name or password": "Nom ou mot de passe incorrect", "Current password is wrong": "Le mot de passe actuel est incorrect", "Missing state": "État manquant", "You cannot delete yourself": "Tu ne peux pas te supprimer toi-même", "Not found": "Introuvable", "Server error": "Erreur du serveur"}, "it": {"Error": "Errore", "Welcome! Create the admin account for this server.": "Benvenuto! Crea l'account amministratore di questo server.", "Create a new account": "Crea un nuovo account", "Sign in to continue": "Accedi per continuare", "Username": "Nome utente", "Password": "Password", "Create account": "Crea account", "Sign in": "Accedi", "Back to sign in": "Torna all'accesso", "Import the local data from this browser into your account?": "Importare i dati locali di questo browser nel tuo account?", "Account": "Account", "Manage users": "Gestisci utenti", "Change password": "Cambia password", "Sign out": "Esci", "Users": "Utenti", "Admin": "Admin", "New user": "Nuovo utente", "Password (min. 6 characters)": "Password (min. 6 caratteri)", "Add": "Aggiungi", "Current password": "Password attuale", "New password": "Nuova password", "User created.": "Utente creato.", "Password changed.": "Password cambiata.", "User deleted.": "Utente eliminato.", "New password (min. 6 characters):": "Nuova password (min. 6 caratteri):", "Delete user “{n}” and all their data?": "Eliminare l'utente «{n}» e tutti i suoi dati?", "Name: 2-32 characters (letters, numbers, _ . -)": "Nome: da 2 a 32 caratteri (lettere, numeri, _ . -)", "Password: at least 6 characters": "Password: almeno 6 caratteri", "That name is already taken": "Questo nome è già in uso", "Not signed in": "Non hai effettuato l'accesso", "Admins only": "Solo per amministratori", "Too many attempts. Please wait 15 minutes.": "Troppi tentativi. Attendi 15 minuti.", "Payload too large": "Dati troppo grandi", "Invalid JSON": "JSON non valido", "Registration is disabled. Ask the admin for an account.": "La registrazione è disattivata. Chiedi un account all'amministratore.", "Wrong name or password": "Nome o password errati", "Current password is wrong": "La password attuale non è corretta", "Missing state": "Stato mancante", "You cannot delete yourself": "Non puoi eliminare te stesso", "Not found": "Non trovato", "Server error": "Errore del server"}, "es": {"Error": "Error", "Welcome! Create the admin account for this server.": "¡Bienvenido! Crea la cuenta de administrador de este servidor.", "Create a new account": "Crear una cuenta nueva", "Sign in to continue": "Inicia sesión para continuar", "Username": "Nombre de usuario", "Password": "Contraseña", "Create account": "Crear cuenta", "Sign in": "Iniciar sesión", "Back to sign in": "Volver a iniciar sesión", "Import the local data from this browser into your account?": "¿Importar los datos locales de este navegador a tu cuenta?", "Account": "Cuenta", "Manage users": "Gestionar usuarios", "Change password": "Cambiar contraseña", "Sign out": "Cerrar sesión", "Users": "Usuarios", "Admin": "Admin", "New user": "Nuevo usuario", "Password (min. 6 characters)": "Contraseña (mín. 6 caracteres)", "Add": "Añadir", "Current password": "Contraseña actual", "New password": "Contraseña nueva", "User created.": "Usuario creado.", "Password changed.": "Contraseña cambiada.", "User deleted.": "Usuario eliminado.", "New password (min. 6 characters):": "Contraseña nueva (mín. 6 caracteres):", "Delete user “{n}” and all their data?": "¿Eliminar al usuario «{n}» y todos sus datos?", "Name: 2-32 characters (letters, numbers, _ . -)": "Nombre: de 2 a 32 caracteres (letras, números, _ . -)", "Password: at least 6 characters": "Contraseña: al menos 6 caracteres", "That name is already taken": "Ese nombre ya está en uso", "Not signed in": "No has iniciado sesión", "Admins only": "Solo para administradores", "Too many attempts. Please wait 15 minutes.": "Demasiados intentos. Espera 15 minutos.", "Payload too large": "Datos demasiado grandes", "Invalid JSON": "JSON no válido", "Registration is disabled. Ask the admin for an account.": "El registro está desactivado. Pide una cuenta al administrador.", "Wrong name or password": "Nombre o contraseña incorrectos", "Current password is wrong": "La contraseña actual es incorrecta", "Missing state": "Falta el estado", "You cannot delete yourself": "No puedes eliminarte a ti mismo", "Not found": "No encontrado", "Server error": "Error del servidor"}, "zh": {"Error": "错误", "Welcome! Create the admin account for this server.": "欢迎！请为此服务器创建管理员账号。", "Create a new account": "创建新账号", "Sign in to continue": "登录以继续", "Username": "用户名", "Password": "密码", "Create account": "创建账号", "Sign in": "登录", "Back to sign in": "返回登录", "Import the local data from this browser into your account?": "要把此浏览器中的本地数据导入你的账号吗？", "Account": "账号", "Manage users": "管理用户", "Change password": "修改密码", "Sign out": "退出登录", "Users": "用户", "Admin": "管理员", "New user": "新用户", "Password (min. 6 characters)": "密码（至少 6 个字符）", "Add": "添加", "Current password": "当前密码", "New password": "新密码", "User created.": "用户已创建。", "Password changed.": "密码已修改。", "User deleted.": "用户已删除。", "New password (min. 6 characters):": "新密码（至少 6 个字符）：", "Delete user “{n}” and all their data?": "要删除用户“{n}”及其所有数据吗？", "Name: 2-32 characters (letters, numbers, _ . -)": "名称：2–32 个字符（字母、数字、_ . -）", "Password: at least 6 characters": "密码：至少 6 个字符", "That name is already taken": "该名称已被使用", "Not signed in": "未登录", "Admins only": "仅限管理员", "Too many attempts. Please wait 15 minutes.": "尝试次数过多，请等待 15 分钟。", "Payload too large": "数据过大", "Invalid JSON": "无效的 JSON", "Registration is disabled. Ask the admin for an account.": "注册已关闭，请向管理员申请账号。", "Wrong name or password": "名称或密码错误", "Current password is wrong": "当前密码不正确", "Missing state": "缺少数据", "You cannot delete yourself": "你不能删除自己", "Not found": "未找到", "Server error": "服务器错误"}, "yue": {"Error": "錯誤", "Welcome! Create the admin account for this server.": "歡迎！請為呢部伺服器建立管理員帳戶。", "Create a new account": "建立新帳戶", "Sign in to continue": "登入以繼續", "Username": "用戶名稱", "Password": "密碼", "Create account": "建立帳戶", "Sign in": "登入", "Back to sign in": "返回登入", "Import the local data from this browser into your account?": "要將呢個瀏覽器入面嘅本機資料匯入你嘅帳戶嗎？", "Account": "帳戶", "Manage users": "管理用戶", "Change password": "更改密碼", "Sign out": "登出", "Users": "用戶", "Admin": "管理員", "New user": "新用戶", "Password (min. 6 characters)": "密碼（最少 6 個字元）", "Add": "新增", "Current password": "目前密碼", "New password": "新密碼", "User created.": "用戶已建立。", "Password changed.": "密碼已更改。", "User deleted.": "用戶已刪除。", "New password (min. 6 characters):": "新密碼（最少 6 個字元）：", "Delete user “{n}” and all their data?": "要刪除用戶「{n}」同佢所有資料嗎？", "Name: 2-32 characters (letters, numbers, _ . -)": "名稱：2–32 個字元（字母、數字、_ . -）", "Password: at least 6 characters": "密碼：最少 6 個字元", "That name is already taken": "呢個名已經有人用", "Not signed in": "未登入", "Admins only": "只限管理員", "Too many attempts. Please wait 15 minutes.": "嘗試次數太多，請等 15 分鐘。", "Payload too large": "資料太大", "Invalid JSON": "無效嘅 JSON", "Registration is disabled. Ask the admin for an account.": "註冊功能已停用，請向管理員申請帳戶。", "Wrong name or password": "名稱或者密碼錯誤", "Current password is wrong": "目前密碼唔正確", "Missing state": "缺少資料", "You cannot delete yourself": "你唔可以刪除自己", "Not found": "搵唔到", "Server error": "伺服器錯誤"}, "ko": {"Error": "오류", "Welcome! Create the admin account for this server.": "환영합니다! 이 서버의 관리자 계정을 만드세요.", "Create a new account": "새 계정 만들기", "Sign in to continue": "계속하려면 로그인하세요", "Username": "사용자 이름", "Password": "비밀번호", "Create account": "계정 만들기", "Sign in": "로그인", "Back to sign in": "로그인으로 돌아가기", "Import the local data from this browser into your account?": "이 브라우저의 로컬 데이터를 계정으로 가져올까요?", "Account": "계정", "Manage users": "사용자 관리", "Change password": "비밀번호 변경", "Sign out": "로그아웃", "Users": "사용자", "Admin": "관리자", "New user": "새 사용자", "Password (min. 6 characters)": "비밀번호(6자 이상)", "Add": "추가", "Current password": "현재 비밀번호", "New password": "새 비밀번호", "User created.": "사용자를 만들었습니다.", "Password changed.": "비밀번호를 변경했습니다.", "User deleted.": "사용자를 삭제했습니다.", "New password (min. 6 characters):": "새 비밀번호(6자 이상):", "Delete user “{n}” and all their data?": "사용자 “{n}”과(와) 모든 데이터를 삭제할까요?", "Name: 2-32 characters (letters, numbers, _ . -)": "이름: 2~32자(문자, 숫자, _ . -)", "Password: at least 6 characters": "비밀번호: 6자 이상", "That name is already taken": "이미 사용 중인 이름입니다", "Not signed in": "로그인되어 있지 않습니다", "Admins only": "관리자 전용입니다", "Too many attempts. Please wait 15 minutes.": "시도 횟수가 너무 많습니다. 15분 후에 다시 시도하세요.", "Payload too large": "데이터가 너무 큽니다", "Invalid JSON": "잘못된 JSON", "Registration is disabled. Ask the admin for an account.": "가입이 비활성화되어 있습니다. 관리자에게 계정을 요청하세요.", "Wrong name or password": "이름 또는 비밀번호가 올바르지 않습니다", "Current password is wrong": "현재 비밀번호가 올바르지 않습니다", "Missing state": "상태 데이터가 없습니다", "You cannot delete yourself": "자기 자신은 삭제할 수 없습니다", "Not found": "찾을 수 없습니다", "Server error": "서버 오류"}, "ja": {"Error": "エラー", "Welcome! Create the admin account for this server.": "ようこそ！このサーバーの管理者アカウントを作成してください。", "Create a new account": "新しいアカウントを作成", "Sign in to continue": "続けるにはサインインしてください", "Username": "ユーザー名", "Password": "パスワード", "Create account": "アカウントを作成", "Sign in": "サインイン", "Back to sign in": "サインインに戻る", "Import the local data from this browser into your account?": "このブラウザのローカルデータをアカウントに取り込みますか？", "Account": "アカウント", "Manage users": "ユーザー管理", "Change password": "パスワードを変更", "Sign out": "サインアウト", "Users": "ユーザー", "Admin": "管理者", "New user": "新しいユーザー", "Password (min. 6 characters)": "パスワード（6文字以上）", "Add": "追加", "Current password": "現在のパスワード", "New password": "新しいパスワード", "User created.": "ユーザーを作成しました。", "Password changed.": "パスワードを変更しました。", "User deleted.": "ユーザーを削除しました。", "New password (min. 6 characters):": "新しいパスワード（6文字以上）：", "Delete user “{n}” and all their data?": "ユーザー「{n}」とそのすべてのデータを削除しますか？", "Name: 2-32 characters (letters, numbers, _ . -)": "名前：2〜32文字（文字、数字、_ . -）", "Password: at least 6 characters": "パスワード：6文字以上", "That name is already taken": "その名前はすでに使われています", "Not signed in": "サインインしていません", "Admins only": "管理者専用です", "Too many attempts. Please wait 15 minutes.": "試行回数が多すぎます。15分待ってください。", "Payload too large": "データが大きすぎます", "Invalid JSON": "無効な JSON", "Registration is disabled. Ask the admin for an account.": "登録は無効です。管理者にアカウントを依頼してください。", "Wrong name or password": "名前またはパスワードが違います", "Current password is wrong": "現在のパスワードが違います", "Missing state": "データがありません", "You cannot delete yourself": "自分自身は削除できません", "Not found": "見つかりません", "Server error": "サーバーエラー"}, "hi": {"Error": "त्रुटि", "Welcome! Create the admin account for this server.": "स्वागत है! इस सर्वर के लिए एडमिन खाता बनाएँ।", "Create a new account": "नया खाता बनाएँ", "Sign in to continue": "जारी रखने के लिए साइन इन करें", "Username": "उपयोगकर्ता नाम", "Password": "पासवर्ड", "Create account": "खाता बनाएँ", "Sign in": "साइन इन करें", "Back to sign in": "साइन इन पर वापस जाएँ", "Import the local data from this browser into your account?": "इस ब्राउज़र का स्थानीय डेटा अपने खाते में लाएँ?", "Account": "खाता", "Manage users": "उपयोगकर्ता प्रबंधित करें", "Change password": "पासवर्ड बदलें", "Sign out": "साइन आउट", "Users": "उपयोगकर्ता", "Admin": "एडमिन", "New user": "नया उपयोगकर्ता", "Password (min. 6 characters)": "पासवर्ड (कम से कम 6 अक्षर)", "Add": "जोड़ें", "Current password": "मौजूदा पासवर्ड", "New password": "नया पासवर्ड", "User created.": "उपयोगकर्ता बन गया।", "Password changed.": "पासवर्ड बदल गया।", "User deleted.": "उपयोगकर्ता हट गया।", "New password (min. 6 characters):": "नया पासवर्ड (कम से कम 6 अक्षर):", "Delete user “{n}” and all their data?": "उपयोगकर्ता “{n}” और उसका सारा डेटा हटाएँ?", "Name: 2-32 characters (letters, numbers, _ . -)": "नाम: 2–32 अक्षर (अक्षर, अंक, _ . -)", "Password: at least 6 characters": "पासवर्ड: कम से कम 6 अक्षर", "That name is already taken": "यह नाम पहले से लिया जा चुका है", "Not signed in": "साइन इन नहीं है", "Admins only": "सिर्फ़ एडमिन के लिए", "Too many attempts. Please wait 15 minutes.": "बहुत ज़्यादा कोशिशें। कृपया 15 मिनट रुकें।", "Payload too large": "डेटा बहुत बड़ा है", "Invalid JSON": "अमान्य JSON", "Registration is disabled. Ask the admin for an account.": "पंजीकरण बंद है। एडमिन से खाता माँगें।", "Wrong name or password": "नाम या पासवर्ड ग़लत है", "Current password is wrong": "मौजूदा पासवर्ड ग़लत है", "Missing state": "स्थिति डेटा नहीं मिला", "You cannot delete yourself": "आप खुद को नहीं हटा सकते", "Not found": "नहीं मिला", "Server error": "सर्वर त्रुटि"}, "ar": {"Error": "خطأ", "Welcome! Create the admin account for this server.": "مرحبًا! أنشئ حساب المسؤول لهذا الخادم.", "Create a new account": "إنشاء حساب جديد", "Sign in to continue": "سجّل الدخول للمتابعة", "Username": "اسم المستخدم", "Password": "كلمة المرور", "Create account": "إنشاء الحساب", "Sign in": "تسجيل الدخول", "Back to sign in": "العودة إلى تسجيل الدخول", "Import the local data from this browser into your account?": "هل تريد استيراد البيانات المحلية من هذا المتصفح إلى حسابك؟", "Account": "الحساب", "Manage users": "إدارة المستخدمين", "Change password": "تغيير كلمة المرور", "Sign out": "تسجيل الخروج", "Users": "المستخدمون", "Admin": "مسؤول", "New user": "مستخدم جديد", "Password (min. 6 characters)": "كلمة المرور (6 أحرف على الأقل)", "Add": "إضافة", "Current password": "كلمة المرور الحالية", "New password": "كلمة المرور الجديدة", "User created.": "تم إنشاء المستخدم.", "Password changed.": "تم تغيير كلمة المرور.", "User deleted.": "تم حذف المستخدم.", "New password (min. 6 characters):": "كلمة المرور الجديدة (6 أحرف على الأقل):", "Delete user “{n}” and all their data?": "هل تريد حذف المستخدم «{n}» وكل بياناته؟", "Name: 2-32 characters (letters, numbers, _ . -)": "الاسم: من 2 إلى 32 حرفًا (حروف وأرقام و _ . -)", "Password: at least 6 characters": "كلمة المرور: 6 أحرف على الأقل", "That name is already taken": "هذا الاسم مستخدم بالفعل", "Not signed in": "لم تسجّل الدخول", "Admins only": "للمسؤولين فقط", "Too many attempts. Please wait 15 minutes.": "محاولات كثيرة جدًا. يرجى الانتظار 15 دقيقة.", "Payload too large": "البيانات كبيرة جدًا", "Invalid JSON": "JSON غير صالح", "Registration is disabled. Ask the admin for an account.": "التسجيل معطّل. اطلب حسابًا من المسؤول.", "Wrong name or password": "اسم أو كلمة مرور خاطئة", "Current password is wrong": "كلمة المرور الحالية غير صحيحة", "Missing state": "البيانات مفقودة", "You cannot delete yourself": "لا يمكنك حذف نفسك", "Not found": "غير موجود", "Server error": "خطأ في الخادم"}};
for (const l in SYNC_TR) Object.assign(TR[l], SYNC_TR[l]);
const LB_TR={"de": {"Leaderboard": "Rangliste", "Completed quests of {n}": "Erledigte Quests von {n}", "Nothing completed yet.": "Noch nichts erledigt.", "Demo: data stays in this browser": "Demo: Daten bleiben in diesem Browser", "Reset demo": "Demo zurücksetzen", "Add demo friends": "Demo-Freunde hinzufügen", "Demo friends added.": "Demo-Freunde hinzugefügt.", "Reset the demo? All demo data in this browser will be deleted.": "Demo zurücksetzen? Alle Demo-Daten in diesem Browser werden gelöscht.", "Join guild": "Gilde beitreten", "All members": "Alle Mitglieder", "Guild options": "Gilden-Optionen", "Members can create invite codes": "Mitglieder dürfen Einladungscodes erstellen", "No quest boards shared yet.": "Noch keine Questboards geteilt.", "Open one of your quest boards and press Share to add it here.": "Öffne eines deiner Questboards und tippe auf Teilen, um es hier hinzuzufügen.", "Only guild admins can share quest boards here.": "Hier dürfen nur Gilden-Admins Questboards teilen.", "Shared quest boards": "Geteilte Questboards", "{n} quests": "{n} Quests", "Members can share their quest boards with this guild": "Mitglieder dürfen ihre Questboards mit dieser Gilde teilen", "Edit guild": "Gilde bearbeiten", "Rename and customize": "Umbenennen und anpassen", "Shared": "Geteilt", "Account settings": "Kontoeinstellungen", "Admin options": "Admin-Optionen", "Activated by:": "Aktiviert von:", "Shared quest board": "Geteiltes Questboard"}, "fr": {"Leaderboard": "Classement", "Completed quests of {n}": "Quests terminées de {n}", "Nothing completed yet.": "Rien de terminé pour l'instant.", "Demo: data stays in this browser": "Démo : les données restent dans ce navigateur", "Reset demo": "Réinitialiser la démo", "Add demo friends": "Ajouter des amis de démo", "Demo friends added.": "Amis de démo ajoutés.", "Reset the demo? All demo data in this browser will be deleted.": "Réinitialiser la démo ? Toutes les données de démo de ce navigateur seront supprimées.", "Join guild": "Rejoindre une guilde", "All members": "Tous les membres", "Guild options": "Options de la guilde", "Members can create invite codes": "Les membres peuvent créer des codes d'invitation", "No quest boards shared yet.": "Aucun tableau de quests partagé pour l'instant.", "Open one of your quest boards and press Share to add it here.": "Ouvre l'un de tes tableaux de quests et appuie sur Partager pour l'ajouter ici.", "Only guild admins can share quest boards here.": "Seuls les admins de la guilde peuvent partager des tableaux ici.", "Shared quest boards": "Tableaux de quests partagés", "{n} quests": "{n} quests", "Members can share their quest boards with this guild": "Les membres peuvent partager leurs tableaux de quests avec cette guilde", "Edit guild": "Modifier la guilde", "Rename and customize": "Renommer et personnaliser", "Shared": "Partagé", "Account settings": "Paramètres du compte", "Admin options": "Options d'administration", "Activated by:": "Activée par :", "Shared quest board": "Tableau de quests partagé"}, "it": {"Leaderboard": "Classifica", "Completed quests of {n}": "Quest completate da {n}", "Nothing completed yet.": "Ancora nulla di completato.", "Demo: data stays in this browser": "Demo: i dati restano in questo browser", "Reset demo": "Reimposta la demo", "Add demo friends": "Aggiungi amici demo", "Demo friends added.": "Amici demo aggiunti.", "Reset the demo? All demo data in this browser will be deleted.": "Reimpostare la demo? Tutti i dati demo in questo browser saranno eliminati.", "Join guild": "Unisciti a una gilda", "All members": "Tutti i membri", "Guild options": "Opzioni della gilda", "Members can create invite codes": "I membri possono creare codici d'invito", "No quest boards shared yet.": "Nessuna bacheca di quest condivisa finora.", "Open one of your quest boards and press Share to add it here.": "Apri una delle tue bacheche e premi Condividi per aggiungerla qui.", "Only guild admins can share quest boards here.": "Qui solo gli admin della gilda possono condividere bacheche.", "Shared quest boards": "Bacheche condivise", "{n} quests": "{n} quest", "Members can share their quest boards with this guild": "I membri possono condividere le proprie bacheche di quest con questa gilda", "Edit guild": "Modifica gilda", "Rename and customize": "Rinomina e personalizza", "Shared": "Condivisa", "Account settings": "Impostazioni account", "Admin options": "Opzioni amministratore", "Activated by:": "Attivata da:", "Shared quest board": "Bacheca di quest condivisa"}, "es": {"Leaderboard": "Clasificación", "Completed quests of {n}": "Quests completadas de {n}", "Nothing completed yet.": "Aún no hay nada completado.", "Demo: data stays in this browser": "Demo: los datos se quedan en este navegador", "Reset demo": "Restablecer demo", "Add demo friends": "Añadir amigos de demo", "Demo friends added.": "Amigos de demo añadidos.", "Reset the demo? All demo data in this browser will be deleted.": "¿Restablecer la demo? Se borrarán todos los datos de demo de este navegador.", "Join guild": "Unirse a un gremio", "All members": "Todos los miembros", "Guild options": "Opciones del gremio", "Members can create invite codes": "Los miembros pueden crear códigos de invitación", "No quest boards shared yet.": "Aún no se ha compartido ningún tablero de quests.", "Open one of your quest boards and press Share to add it here.": "Abre uno de tus tableros y pulsa Compartir para añadirlo aquí.", "Only guild admins can share quest boards here.": "Aquí solo los administradores del gremio pueden compartir tableros.", "Shared quest boards": "Tableros compartidos", "{n} quests": "{n} quests", "Members can share their quest boards with this guild": "Los miembros pueden compartir sus tableros de quests con este gremio", "Edit guild": "Editar gremio", "Rename and customize": "Renombrar y personalizar", "Shared": "Compartido", "Account settings": "Ajustes de la cuenta", "Admin options": "Opciones de administrador", "Activated by:": "Activada por:", "Shared quest board": "Tablero de quests compartido"}, "zh": {"Leaderboard": "排行榜", "Completed quests of {n}": "{n} 完成的奎斯特", "Nothing completed yet.": "还没有完成任何奎斯特。", "Demo: data stays in this browser": "演示：数据仅保存在此浏览器中", "Reset demo": "重置演示", "Add demo friends": "添加演示好友", "Demo friends added.": "已添加演示好友。", "Reset the demo? All demo data in this browser will be deleted.": "重置演示？此浏览器中的所有演示数据将被删除。", "Join guild": "加入公会", "All members": "所有成员", "Guild options": "公会选项", "Members can create invite codes": "成员可以生成邀请码", "No quest boards shared yet.": "还没有分享任何奎斯特板。", "Open one of your quest boards and press Share to add it here.": "打开你的一个奎斯特板并点击分享，即可添加到这里。", "Only guild admins can share quest boards here.": "这里只有公会管理员可以分享奎斯特板。", "Shared quest boards": "共享的奎斯特板", "{n} quests": "{n} 个奎斯特", "Members can share their quest boards with this guild": "成员可以与此公会分享自己的奎斯特板", "Edit guild": "编辑公会", "Rename and customize": "重命名并自定义", "Shared": "已共享", "Account settings": "账号设置", "Admin options": "管理员选项", "Activated by:": "激活者：", "Shared quest board": "已共享的奎斯特板"}, "yue": {"Leaderboard": "排行榜", "Completed quests of {n}": "{n} 完成嘅奎斯特", "Nothing completed yet.": "仲未完成任何奎斯特。", "Demo: data stays in this browser": "示範：資料只會留喺呢個瀏覽器", "Reset demo": "重設示範", "Add demo friends": "加入示範朋友", "Demo friends added.": "已加入示範朋友。", "Reset the demo? All demo data in this browser will be deleted.": "重設示範？呢個瀏覽器入面所有示範資料都會被刪除。", "Join guild": "加入公會", "All members": "所有成員", "Guild options": "公會選項", "Members can create invite codes": "成員可以產生邀請碼", "No quest boards shared yet.": "仲未分享任何奎斯特板。", "Open one of your quest boards and press Share to add it here.": "打開你嘅其中一個奎斯特板，㩒分享就可以加入呢度。", "Only guild admins can share quest boards here.": "呢度只有公會管理員可以分享奎斯特板。", "Shared quest boards": "共享嘅奎斯特板", "{n} quests": "{n} 個奎斯特", "Members can share their quest boards with this guild": "成員可以同呢個公會分享自己嘅奎斯特板", "Edit guild": "編輯公會", "Rename and customize": "重新命名並自訂", "Shared": "已分享", "Account settings": "帳戶設定", "Admin options": "管理員選項", "Activated by:": "啟動者：", "Shared quest board": "已分享嘅奎斯特板"}, "ko": {"Leaderboard": "리더보드", "Completed quests of {n}": "{n}님이 완료한 퀘스트", "Nothing completed yet.": "아직 완료한 것이 없습니다.", "Demo: data stays in this browser": "데모: 데이터는 이 브라우저에만 저장됩니다", "Reset demo": "데모 초기화", "Add demo friends": "데모 친구 추가", "Demo friends added.": "데모 친구를 추가했습니다.", "Reset the demo? All demo data in this browser will be deleted.": "데모를 초기화할까요? 이 브라우저의 모든 데모 데이터가 삭제됩니다.", "Join guild": "길드 가입", "All members": "모든 멤버", "Guild options": "길드 옵션", "Members can create invite codes": "멤버가 초대 코드를 만들 수 있음", "No quest boards shared yet.": "아직 공유된 퀘스트 보드가 없습니다.", "Open one of your quest boards and press Share to add it here.": "퀘스트 보드를 열고 공유를 눌러 여기에 추가하세요.", "Only guild admins can share quest boards here.": "여기서는 길드 관리자만 퀘스트 보드를 공유할 수 있습니다.", "Shared quest boards": "공유된 퀘스트 보드", "{n} quests": "퀘스트 {n}개", "Members can share their quest boards with this guild": "멤버가 자신의 퀘스트 보드를 이 길드와 공유할 수 있음", "Edit guild": "길드 편집", "Rename and customize": "이름 변경 및 꾸미기", "Shared": "공유됨", "Account settings": "계정 설정", "Admin options": "관리자 옵션", "Activated by:": "활성화한 사람:", "Shared quest board": "공유된 퀘스트 보드"}, "ja": {"Leaderboard": "リーダーボード", "Completed quests of {n}": "{n} の完了したクエスト", "Nothing completed yet.": "まだ完了したものはありません。", "Demo: data stays in this browser": "デモ：データはこのブラウザ内にのみ保存されます", "Reset demo": "デモをリセット", "Add demo friends": "デモ用フレンドを追加", "Demo friends added.": "デモ用フレンドを追加しました。", "Reset the demo? All demo data in this browser will be deleted.": "デモをリセットしますか？このブラウザ内のデモデータはすべて削除されます。", "Join guild": "ギルドに参加", "All members": "全メンバー", "Guild options": "ギルドの設定", "Members can create invite codes": "メンバーが招待コードを作成できる", "No quest boards shared yet.": "まだ共有されたクエストボードはありません。", "Open one of your quest boards and press Share to add it here.": "自分のクエストボードを開いて「共有」を押すと、ここに追加できます。", "Only guild admins can share quest boards here.": "ここではギルド管理者だけがクエストボードを共有できます。", "Shared quest boards": "共有クエストボード", "{n} quests": "{n} クエスト", "Members can share their quest boards with this guild": "メンバーは自分のクエストボードをこのギルドと共有できる", "Edit guild": "ギルドを編集", "Rename and customize": "名前変更とカスタマイズ", "Shared": "共有済み", "Account settings": "アカウント設定", "Admin options": "管理者オプション", "Activated by:": "アクティブにした人：", "Shared quest board": "共有されたクエストボード"}, "hi": {"Leaderboard": "लीडरबोर्ड", "Completed quests of {n}": "{n} के पूरे किए गए क्वेस्ट", "Nothing completed yet.": "अभी तक कुछ पूरा नहीं हुआ।", "Demo: data stays in this browser": "डेमो: डेटा इसी ब्राउज़र में रहता है", "Reset demo": "डेमो रीसेट करें", "Add demo friends": "डेमो दोस्त जोड़ें", "Demo friends added.": "डेमो दोस्त जोड़ दिए गए।", "Reset the demo? All demo data in this browser will be deleted.": "डेमो रीसेट करें? इस ब्राउज़र का सारा डेमो डेटा हटा दिया जाएगा।", "Join guild": "गिल्ड से जुड़ें", "All members": "सभी सदस्य", "Guild options": "गिल्ड विकल्प", "Members can create invite codes": "सदस्य आमंत्रण कोड बना सकते हैं", "No quest boards shared yet.": "अभी तक कोई क्वेस्ट बोर्ड साझा नहीं किया गया।", "Open one of your quest boards and press Share to add it here.": "अपना कोई क्वेस्ट बोर्ड खोलें और यहाँ जोड़ने के लिए साझा करें दबाएँ।", "Only guild admins can share quest boards here.": "यहाँ केवल गिल्ड एडमिन क्वेस्ट बोर्ड साझा कर सकते हैं।", "Shared quest boards": "साझा क्वेस्ट बोर्ड", "{n} quests": "{n} क्वेस्ट", "Members can share their quest boards with this guild": "सदस्य अपने क्वेस्ट बोर्ड इस गिल्ड के साथ साझा कर सकते हैं", "Edit guild": "गिल्ड संपादित करें", "Rename and customize": "नाम बदलें और अनुकूलित करें", "Shared": "साझा किया गया", "Account settings": "खाता सेटिंग्स", "Admin options": "एडमिन विकल्प", "Activated by:": "सक्रिय करने वाले:", "Shared quest board": "साझा किया गया क्वेस्ट बोर्ड"}, "ar": {"Leaderboard": "لوحة الصدارة", "Completed quests of {n}": "الكويست المكتملة لـ {n}", "Nothing completed yet.": "لم يكتمل شيء بعد.", "Demo: data stays in this browser": "تجريبي: تبقى البيانات في هذا المتصفح", "Reset demo": "إعادة ضبط التجربة", "Add demo friends": "إضافة أصدقاء تجريبيين", "Demo friends added.": "تمت إضافة الأصدقاء التجريبيين.", "Reset the demo? All demo data in this browser will be deleted.": "إعادة ضبط التجربة؟ سيتم حذف جميع البيانات التجريبية في هذا المتصفح.", "Join guild": "الانضمام إلى نقابة", "All members": "كل الأعضاء", "Guild options": "خيارات النقابة", "Members can create invite codes": "يمكن للأعضاء إنشاء رموز دعوة", "No quest boards shared yet.": "لم تتم مشاركة أي لوحة كويست بعد.", "Open one of your quest boards and press Share to add it here.": "افتح إحدى لوحات الكويستات واضغط مشاركة لإضافتها هنا.", "Only guild admins can share quest boards here.": "يمكن لمشرفي النقابة فقط مشاركة لوحات الكويستات هنا.", "Shared quest boards": "لوحات الكويستات المشتركة", "{n} quests": "{n} كويست", "Members can share their quest boards with this guild": "يمكن للأعضاء مشاركة لوحات الكويستات الخاصة بهم مع هذه النقابة", "Edit guild": "تعديل النقابة", "Rename and customize": "إعادة التسمية والتخصيص", "Shared": "تمت المشاركة", "Account settings": "إعدادات الحساب", "Admin options": "خيارات المشرف", "Activated by:": "فعّلها:", "Shared quest board": "لوحة الكويستات المشتركة"}};
for (const l in LB_TR) if (TR[l] || l === 'de') Object.assign(l === 'de' ? DE : TR[l], LB_TR[l]);
(() => {
  const TK = 'ikan-token', blank = () => ({ cats: [], xp: 0, hist: [], ash: [] });
  const ls = { get: k => { try { return localStorage.getItem(k) } catch (e) { return null } }, set: (k, v) => { try { localStorage.setItem(k, v) } catch (e) {} }, del: k => { try { localStorage.removeItem(k) } catch (e) {} } };
  let authState = null, token = ls.get(TK), me = null, upd = 0, timer = null, pend = null, poller = null;
  const $ = id => document.getElementById(id);
  const api = async (m, u, b) => {
    const r = await fetch(u, { method: m, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) }, body: b ? JSON.stringify(b) : undefined });
    let j = {}; try { j = await r.json() } catch (e) {}
    if (!r.ok) throw Object.assign(new Error(j.error || 'Error'), { status: r.status });
    return j;
  };

  const st = document.createElement('style');
  st.textContent = 'input[type=password]{width:100%;font:inherit;font-weight:700;color:var(--ink);background:var(--bg);border:2px solid var(--line);border-radius:14px;padding:11px 14px;outline:none}input[type=password]:focus{border-color:#1cb0f6}#auth{position:fixed;inset:0;z-index:60;background:var(--bg);display:none;align-items:center;justify-content:center;padding:16px}#auth .card{background:var(--card);border:2px solid var(--line);border-bottom-width:5px;border-radius:24px;padding:24px;width:100%;max-width:380px}#auth .ahead{display:flex;align-items:center;gap:10px;margin-bottom:8px}#auth .ahead .logo{white-space:nowrap;flex:none}#auth .ahead select{flex:0 1 auto;min-width:0;width:auto;max-width:9.5em;margin-inline-start:auto;font-size:14px;padding:6px 8px;text-overflow:ellipsis}#auth .err{color:#ff4b4b;min-height:22px;margin:10px 0 0;font-size:14px}.lnk{background:none;border:0;color:#1cb0f6;font:inherit;font-weight:900;cursor:pointer;margin-top:12px;padding:0}';
  document.head.appendChild(st);
  const ov = document.createElement('div'); ov.id = 'auth'; document.body.appendChild(ov);

  function showAuth(mode, status) {
    const setup = mode === 'setup', reg = mode === 'register';
    authState = [mode, status];
    ov.style.display = 'flex';
    ov.innerHTML = `<form class="card"><div class="ahead"><div class="logo">Ikan Quests</div><select id="lg" aria-label="Language">${LANGS.map(([v, n]) => `<option value="${v}">${n}</option>`).join('')}</select></div>
      <p style="margin:0 0 14px;color:var(--mute)">${setup ? t('Welcome! Create the admin account for this server.') : reg ? t('Create a new account') : t('Sign in to continue')}</p>
      <label class="l" for="au">${t('Username')}</label><input type="text" id="au" autocomplete="username" maxlength="32">
      <label class="l" for="ap">${t('Password')}</label><input type="password" id="ap" autocomplete="${setup || reg ? 'new-password' : 'current-password'}">
      <div class="err" id="ae"></div>
      <button class="btn full" type="submit" style="margin-top:8px">${setup || reg ? t('Create account') : t('Sign in')}</button>
      ${!setup && status.registration ? `<button type="button" class="lnk" id="tg">${reg ? t('Back to sign in') : t('Create a new account')}</button>` : ''}</form>`;
    $('au').focus(); $('lg').value = lang; $('lg').onchange = e => setLang(e.target.value);
    if ($('tg')) $('tg').onclick = () => showAuth(reg ? 'login' : 'register', status);
    ov.firstChild.onsubmit = async e => {
      e.preventDefault();
      try {
        const j = await api('POST', setup || reg ? '/api/register' : '/api/login', { name: $('au').value.trim(), password: $('ap').value });
        token = j.token; ls.set(TK, token); await start();
      } catch (x) { $('ae').textContent = t(x.message); }
    };
  }

  async function gate() {
    let status; try { status = await api('GET', '/api/status') } catch (e) { return }
    if (token) { try { await start(); return } catch (e) { token = null; ls.del(TK) } }
    showAuth(status.setup ? 'setup' : 'login', status);
  }

  async function start() {
    me = await api('GET', '/api/me');
    const j = await api('GET', '/api/state');
    if (j.state) { S = j.state; upd = j.updated; }
    else {
      S = blank();
      const local = ls.get('ikan-quests');
      if (local && confirm(t('Import the local data from this browser into your account?'))) { try { S = JSON.parse(local); ls.del('ikan-quests'); } catch (e) {} }
      await api('PUT', '/api/state', { state: S }).then(r => upd = r.updated);
    }
    await G.init();
    ov.style.display = 'none'; ov.innerHTML = '';
    window.IkanAccount = me;
    render();
    clearInterval(poller); poller = setInterval(poll, 15000);
  }

  Store.write = s => { G.stampAll(); pend = s; clearTimeout(timer); timer = setTimeout(flush, 400); };
  async function flush() {
    if (!pend || !token) return;
    const s = pend; pend = null;
    try {
      upd = (await api('PUT', '/api/state', { state: s })).updated;
      if (await G.push()) { render(); save(); } // others' edits were merged into a shared board
    } catch (e) { if (e.status === 401) return out(); pend = pend || s; timer = setTimeout(flush, 5000); }
  }
  async function poll() {
    if (!token || pend || document.hidden || draft || window.__dragging || $('modal').innerHTML) return;
    try {
      const j = await api('GET', '/api/state'); if (j.state && j.updated > upd) { S = j.state; upd = j.updated; G.resnapAll(); render(); }
      await G.sync();
    }
    catch (e) { if (e.status === 401) out(); }
  }
  function out() { token = null; window.IkanAccount = null; ls.del(TK); clearInterval(poller); G.reset(); S = blank(); render(); gateAgain(); }
  async function gateAgain() { try { showAuth('login', await api('GET', '/api/status')) } catch (e) {} }
  document.addEventListener('visibilitychange', () => { if (document.hidden) { clearTimeout(timer); flush(); } });


  // ---- Guilds and shared quest boards ----
  // A shared board lives on the server; every member keeps a local copy inside their own state (S.cats entry with `sid`).
  // Copies are merged quest by quest (newer `u` wins, deletions are tombstones in `del`), so two people can edit at the same time.
  // Personal per quest/board: the "active" flag and the board's XP never leave the device.
  const G = (() => {
    let guilds = [], pushed = {}, snaps = {}, sending = false;
    const M = h => { modal(h); try { syncBars() } catch (e) {} };
    const name = gid => (guilds.find(g => g.id === gid) || {}).name || '';
    const guildOwner = gid => (guilds.find(g => g.id === gid) || {}).owner_id;
    const canUnshare = c => c.own === me.id || guildOwner(c.gid) === me.id;
    const serial = c => ({ name: c.name, color: c.color, color2: c.color2 || '', pat: c.pat || 'none', emoji: c.emoji || '', u: c.u || 0, del: c.del || {}, quests: c.quests.map(({ active, ...r }) => r) });
    const qj = q => { const { active, u, ...r } = q; return JSON.stringify(r); };
    const mj = c => JSON.stringify([c.name, c.color, c.color2, c.pat, c.emoji]);
    const resnap = c => { snaps[c.id] = { m: mj(c), q: Object.fromEntries(c.quests.map(q => [q.id, qj(q)])) }; };
    const resnapAll = () => S.cats.forEach(c => c.sid && resnap(c));
    function mergeBoard(a, b) { // same rules as the server
      const meta = b.u > a.u ? b : a, del = { ...a.del };
      for (const [k, v] of Object.entries(b.del || {})) del[k] = Math.max(del[k] || 0, v);
      const map = new Map(a.quests.map(x => [x.id, x]));
      for (const x of b.quests) { const o = map.get(x.id); if (!o || (x.u || 0) > (o.u || 0)) map.set(x.id, x); }
      return { name: meta.name, color: meta.color, color2: meta.color2, pat: meta.pat, emoji: meta.emoji, u: Math.max(a.u, b.u), del, quests: [...map.values()].filter(x => !(del[x.id] >= (x.u || 0))) };
    }
    function apply(c, b) { // write a board version into the local copy, keeping personal flags
      const act = new Map(c.quests.map(q => [q.id, q.active]));
      Object.assign(c, { name: b.name, color: b.color, color2: b.color2 || c.color2, pat: b.pat, emoji: b.emoji, u: b.u, del: b.del });
      c.quests = b.quests.map(q => ({ ...q, active: !!act.get(q.id) })).sort((x, y) => (x.ord ?? 1e9) - (y.ord ?? 1e9)); // `ord` carries a manual reorder
      resnap(c);
    }
    // Called on every local save: remember which quests/boards were edited or removed by the user.
    function stampAll() {
      const now = Date.now();
      for (const c of S.cats) {
        if (!c.sid) continue;
        const sn = snaps[c.id]; if (!sn) { resnap(c); continue; }
        if (sn.m !== mj(c)) c.u = now;
        const cur = {};
        for (const q of c.quests) { cur[q.id] = qj(q); if (sn.q[q.id] !== cur[q.id]) q.u = now; }
        for (const id in sn.q) if (!(id in cur)) (c.del = c.del || {})[id] = now;
        snaps[c.id] = { m: mj(c), q: cur };
      }
    }
    // Completions on shared boards are reported to the server through a small outbox, so nothing is lost while offline.
    const pending = sid => (S.outbox || []).filter(o => o.board === sid).reduce((n, o) => n + (o.del ? -o.x : o.x), 0);
    function onDone(c, he) {
      (S.outbox = S.outbox || []).push({ id: he.id, board: c.sid, t: he.t, bn: c.name, x: Math.min(200, Math.max(1, he.x)), d: he.d, qid: he.q && he.q.id });
    }
    function onUndo(h) {
      const ob = S.outbox = S.outbox || [], i = ob.findIndex(o => o.id === h.id && !o.del);
      if (i >= 0) ob.splice(i, 1); else ob.push({ id: h.id, del: true, board: h.sid, x: Math.min(200, Math.max(1, h.x)) });
    }
    async function sendOutbox() {
      if (sending || !(S.outbox || []).length) return false;
      sending = true; let did = false;
      try {
        while (S.outbox.length) {
          const o = S.outbox[0];
          try {
            if (o.del) await api('DELETE', '/api/completions/' + o.id);
            else await api('POST', `/api/boards/${o.board}/complete`, { id: o.id, title: o.t, bname: o.bn, xp: o.x, ts: o.d, quest: o.qid });
          } catch (e) { if (!e.status || e.status === 401 || e.status >= 500) throw e; } // 4xx: the board is gone or the entry is invalid, drop it
          S.outbox.shift(); did = true;
        }
      } finally { sending = false; }
      return did;
    }
    async function refreshGuilds() { guilds = (await api('GET', '/api/guilds')).guilds; }
    function reconcile(list) {
      const before = JSON.stringify(S.cats), ids = new Set(list.map(b => b.id));
      S.hide = S.hide || {};
      for (const sb of list) {
        if (S.hide[sb.id]) continue;
        let c = S.cats.find(x => x.sid === sb.id);
        if (!c) { c = { id: uid(), sid: sb.id, xp: 0, quests: [] }; S.cats.push(c); apply(c, sb.board); c.quests.forEach(q => { q.active = ((sb.acts || {})[q.id] || []).includes(me.name); }); } // a new copy starts with what the server knows
        else apply(c, mergeBoard(sb.board, serial(c)));
        c.gid = sb.guild_id; c.own = sb.owner_id; c.acts = sb.acts || {};
        c.xp = Math.max(0, (sb.xp || 0) + pending(sb.id)); // a shared board's XP is the sum of everything its members completed
        pushed[sb.id] = JSON.stringify(sb.board); // what the server has; push() sends if the local copy differs
      }
      for (const c of S.cats) if (c.sid && !ids.has(c.sid)) { for (const k of ['sid', 'gid', 'own', 'u', 'del']) delete c[k]; delete snaps[c.id]; } // no longer shared: keep as a personal board
      for (const k of Object.keys(S.hide)) if (!ids.has(k)) delete S.hide[k];
      return JSON.stringify(S.cats) !== before;
    }
    async function pull() {
      const j = await api('GET', '/api/boards');
      if (j.boards.some(b => !guilds.some(g => g.id === b.guild_id))) await refreshGuilds();
      return reconcile(j.boards);
    }
    async function push() {
      let changed = false;
      if (await sendOutbox()) changed = true;
      for (const c of S.cats.filter(x => x.sid)) { // tell the guild which shared quests I have active
        for (const q of c.quests) {
          const has = ((c.acts || {})[q.id] || []).includes(me.name);
          if (!!q.active === has) continue;
          try { c.acts = (await api('POST', `/api/boards/${c.sid}/activate`, { quest: q.id, on: !!q.active })).acts; changed = true; } catch (e) { if (!e.status || e.status >= 500) throw e; }
        }
      }
      for (const c of S.cats.filter(x => x.sid)) {
        const cur = JSON.stringify(serial(c));
        if (pushed[c.sid] === cur) continue;
        try {
          const r = await api('PUT', '/api/boards/' + c.sid, { board: serial(c) });
          apply(c, r.board); pushed[c.sid] = JSON.stringify(serial(c));
          if (pushed[c.sid] !== cur) changed = true;
        } catch (e) { if (e.status !== 404) throw e; }
      }
      return changed;
    }
    async function init() { S.hide = S.hide || {}; try { await refreshGuilds(); resnapAll(); await pull(); } catch (e) {} }
    const reset = () => { guilds = []; pushed = {}; snaps = {}; };

    const fmtCode = c => c.slice(0, 4) + '-' + c.slice(4);
    let stats = {};
    const RANK = ['🥇', '🥈', '🥉'];
    const pct = m => Math.round((m.share || 0) * 100) + '%';
    const lbRow = (m, i, gid, extra = '') => `<div class="row" style="align-items:center;margin-bottom:6px;gap:8px;flex-wrap:nowrap"><span style="width:30px;text-align:center;font-weight:900">${RANK[i] || i + 1}</span><span style="flex:1;min-width:0;font-weight:${m.id === me.id ? 900 : 700};overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(m.name)}${m.id === me.id ? ' ·' : ''}</span><button data-g="ucomp" data-id="${gid}" data-u="${m.id}" data-n="${esc(m.name)}" style="background:none;border:0;box-shadow:none;color:inherit;font:inherit;font-weight:800;cursor:pointer;padding:2px 6px;text-decoration:underline dotted;text-underline-offset:3px">✅ ${m.count}</button><span style="width:44px;text-align:right;font-weight:900">${pct(m)}</span>${extra ? `<span style="min-width:84px;text-align:right">${extra}</span>` : ''}</div>`;
    const top3 = g => {
      const st = stats[g.id]; if (!st) return '';
      const mem = st.members, mi = mem.findIndex(m => m.id === me.id);
      return `<div class="hint" style="margin:0 0 6px">🏆 Top 3</div>${mem.slice(0, 3).map((m, i) => lbRow(m, i, g.id)).join('')}${mi >= 3 ? `<div style="text-align:center;color:var(--mute);line-height:.8;margin-bottom:4px">⋮</div>${lbRow(mem[mi], mi, g.id)}` : ''}`;
    };
    const gcol = g => g.color || '#1cb0f6';
    const gbg = g => { const c = gcol(g); return catBG(g.pat || 'none', c, g.color2 || defSec(c), g.emoji); };
    const card = g => `<div class="q"><button class="cprev${isLight(gcol(g)) ? ' light' : ''}" data-g="page" data-id="${g.id}" style="${gbg(g)};width:100%;border:0;font-family:inherit;cursor:pointer;text-align:start;margin-bottom:10px">🛡️ ${esc(g.name)} ›</button>
      <button type="button" data-g="ghist" data-id="${g.id}" class="count lv nt" data-x="${g.xp || 0}" data-m="5" style="--p:${lvP(g.xp || 0, 5)};width:100%;box-sizing:border-box;margin:0 0 10px;padding:6px 10px;text-align:center;border:0;color:#fff;cursor:pointer;font-family:inherit">${lvTxt(g.xp || 0, 5)}</button>
      ${top3(g)}
      <button class="btn sec full" style="margin:6px 0 10px" data-g="board" data-id="${g.id}">👥 ${t('All members')} (${g.members.length})</button>
      <div class="row" style="margin-top:12px"><button class="btn sec red" data-g="leave" data-id="${g.id}">${t('Leave guild')}</button>${g.mine ? `<button class="btn solid" data-g="delg" data-id="${g.id}">${t('Delete guild')}</button>` : ''}</div></div>`;
    async function open() {
      try { await refreshGuilds(); } catch (e) { return toast(t(e.message)); }
      stats = {}; await Promise.all(guilds.map(async g => { try { stats[g.id] = await api('GET', `/api/guilds/${g.id}/stats`); } catch (e) {} }));
      M(`<h3>🛡️ ${t('Guilds')}</h3>
        <div class="row" style="margin-bottom:14px;gap:8px"><button class="btn full" style="flex:1" data-g="joinform">${t('Join guild')}</button><button class="btn full" style="flex:1" data-g="createform">${t('Create guild')}</button></div>
        ${guilds.length ? guilds.map(card).join('') : `<p class="hint">${t('You are not in a guild yet. Create one or join with an invite code.')}</p>`}
        <div class="foot"><button class="btn sec" data-a="close">${t('Close')}</button></div>`);
    }
    async function guildPage(gid) { // a guild's shared quest boards; the owner gets the options gear
      let bl; try { await refreshGuilds(); bl = (await api('GET', '/api/boards')).boards.filter(b => b.guild_id === gid); } catch (e) { return toast(t(e.message)); }
      const g = guilds.find(x => x.id === gid); if (!g) return open();
      M(`<div class="row" style="align-items:center;justify-content:space-between;gap:8px;flex-wrap:nowrap"><div class="cprev${isLight(gcol(g)) ? ' light' : ''}" style="${gbg(g)};flex:1;min-width:0;margin:0">🛡️ ${esc(g.name)}</div>${g.mine ? `<button class="btn sec sm" data-g="gopts" data-id="${gid}" aria-label="${t('Guild options')}" title="${t('Guild options')}">⚙️</button>` : ''}</div>
        <button type="button" data-g="ghist" data-id="${gid}" class="count lv nt" data-x="${g.xp || 0}" data-m="5" style="--p:${lvP(g.xp || 0, 5)};width:100%;box-sizing:border-box;margin:12px 0;padding:6px 10px;text-align:center;border:0;color:#fff;cursor:pointer;font-family:inherit">${lvTxt(g.xp || 0, 5)}</button>
        <div class="hint" style="margin:0 0 6px">${t('Shared quest boards')}</div>
        ${bl.length ? bl.map(b => `<div class="q" style="margin-bottom:8px;display:flex;align-items:center;gap:10px"><span style="width:16px;height:16px;border-radius:50%;flex:none;background:${esc(b.board.color || '#999')}"></span><span style="flex:1;min-width:0;font-weight:800;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc((b.board.emoji ? b.board.emoji + ' ' : '') + b.board.name)}</span><span class="hint" style="margin:0;white-space:nowrap">${t('{n} quests', { n: b.board.quests.length })} · Lvl. ${lvlInfo(b.xp || 0, 1).L}</span></div>`).join('')
          : `<p class="hint">${t('No quest boards shared yet.')} ${g.can_board ? t('Open one of your quest boards and press Share to add it here.') : t('Only guild admins can share quest boards here.')}</p>`}
        <button class="btn sec full" style="margin:6px 0 10px" data-g="board" data-id="${gid}">👥 ${t('All members')} (${g.members.length})</button>
        <div class="foot"><button class="btn sec" data-g="open">${t('Back')}</button></div>`);
    }
    async function guildHistory(gid) { // every quest finished inside the guild, by anyone
      let j; try { j = await api('GET', `/api/guilds/${gid}/completions`); } catch (e) { return toast(t(e.message)); }
      const g = guilds.find(x => x.id === gid) || {};
      logModal(t('⚡ Completed quests ({n})', { n: j.items.length }), j.items.slice().reverse().map(i => ({ id: i.id, c: gcol(g), t: i.title, n: i.bname, d: i.ts, u: i.user })), t('Nothing completed yet.'), h => '👤 ' + esc(h.u), `<button class="btn sec" data-g="page" data-id="${gid}">${t('Back')}</button>`);
    }
    function editStyle(gid) { // reuses the quest board editor (name, color, pattern, emoji) for the guild
      const g = guilds.find(x => x.id === gid); if (!g || !g.mine) return;
      const col = gcol(g);
      draft = { kind: 'cat', guild: gid, name: g.name, color: col, pat: g.pat || 'none', color2: g.color2 || defSec(col), emoji: g.emoji || '' };
      catModal(true);
    }
    async function saveStyle(d) {
      const name = (d.name || '').trim();
      if (name.length < 2) return fieldErr('nm', 'A name is required.');
      try {
        const r = await api('POST', `/api/guilds/${d.guild}/style`, { name, color: d.color, color2: d.color2, pat: d.pat, emoji: d.emoji || '' });
        const i = guilds.findIndex(x => x.id === d.guild); if (i >= 0) guilds[i] = r.guild;
        draft = null; render(); await guildPage(d.guild);
      } catch (x) { toast(t(x.message)); }
    }
    function guildOptions(gid) {
      const g = guilds.find(x => x.id === gid); if (!g || !g.mine) return;
      const cb = (k, on, label) => `<label style="display:flex;align-items:center;gap:10px;margin:10px 0;font-weight:700;cursor:pointer"><input type="checkbox" data-g="perm" data-id="${gid}" data-k="${k}" ${on ? 'checked' : ''} style="width:22px;height:22px;flex:none">${label}</label>`;
      M(`<h3>⚙️ ${t('Guild options')}</h3><button class="btn sec full" data-g="editstyle" data-id="${gid}">✏️ ${t('Rename and customize')}</button>${cb('perm_code', g.perm_code, t('Members can create invite codes'))}${cb('perm_board', g.perm_board, t('Members can share their quest boards with this guild'))}<div class="foot"><button class="btn sec" data-g="page" data-id="${gid}">${t('Back')}</button></div>`);
    }
    document.addEventListener('change', async e => {
      const el = e.target.closest('[data-g=perm]'); if (!el) return;
      const gid = +el.dataset.id, v = k => { const x = document.querySelector(`[data-g=perm][data-k=${k}]`); return !!(x && x.checked); };
      try { const r = await api('POST', `/api/guilds/${gid}/settings`, { perm_code: v('perm_code'), perm_board: v('perm_board') }); const i = guilds.findIndex(x => x.id === gid); if (i >= 0) guilds[i] = r.guild; } catch (x) { toast(t(x.message)); }
    });
    let askCb = null;
    const ask = (title, text, ok, fn) => { askCb = fn; M(`<h3>${title}</h3><p>${text}</p><div class="foot"><button class="btn sec" data-a="close">${t('Cancel')}</button><button class="btn solid" data-g="askok">${ok}</button></div>`); };
    window.IkanAsk = ask;
    const joinForm = () => M(`<h3>🛡️ ${t('Join guild')}</h3><label class="l" for="gj">${t('Invite code')}</label><div class="row"><input type="text" id="gj" maxlength="12" placeholder="${t('Enter the invite code')}" autocomplete="off" style="flex:1;min-width:0"><button class="btn" data-g="join">${t('Join')}</button></div><div class="foot"><button class="btn sec" data-g="open">${t('Back')}</button></div>`);
    const createForm = () => M(`<h3>🛡️ ${t('Create guild')}</h3><label class="l" for="gn">${t('Guild name')}</label><div class="row"><input type="text" id="gn" maxlength="40" placeholder="${t('e.g. Study group, Family')}" autocomplete="off" style="flex:1;min-width:0"><button class="btn" data-g="create">${t('Create guild')}</button></div><div class="foot"><button class="btn sec" data-g="open">${t('Back')}</button></div>`);
    async function leaderboard(gid) { // "All members": full ranking, owner can remove members
      let st; try { st = await api('GET', `/api/guilds/${gid}/stats`); await refreshGuilds(); } catch (e) { return toast(t(e.message)); }
      const g = guilds.find(x => x.id === gid); if (!g) return open();
      M(`<h3>👥 ${t('All members')}</h3><p class="hint" style="margin-top:0">🛡️ ${esc(g.name)}</p>
        <div class="count lv nt" data-x="${st.xp || 0}" data-m="5" style="--p:${lvP(st.xp || 0, 5)};width:100%;box-sizing:border-box;margin:0 0 12px;padding:6px 10px;text-align:center">${lvTxt(st.xp || 0, 5)}</div>
        ${st.members.map((m, i) => lbRow(m, i, gid, g.mine && m.id !== me.id ? `<button class="btn sec sm red" data-g="kick" data-id="${gid}" data-u="${m.id}" data-back="1">${t('Remove')}</button>` : (m.id === g.owner_id ? '👑' : ''))).join('')}
        <div class="hint" style="margin:12px 0 4px">${t('Invite code')}</div>
        <div class="row" style="align-items:stretch;gap:8px;flex-wrap:nowrap"><span class="gcode" style="flex:2;min-width:0;display:flex;align-items:center;justify-content:center">${fmtCode(g.code)}</span><button class="btn sec sm" style="flex:1" data-g="copy" data-c="${g.code}">${t('Copy')}</button>${g.can_code ? `<button class="btn sec sm" style="flex:1" data-g="newcode" data-id="${g.id}" data-back="1">${t('New code')}</button>` : ''}</div>
        ${window.IkanDemo ? `<button class="btn sec full" style="margin-top:12px" data-g="demofriends" data-id="${g.id}">🤖 ${t('Add demo friends')}</button>` : ''}
        <div class="foot"><button class="btn sec" data-g="page" data-id="${gid}">${t('Back')}</button></div>`);
    }
    async function userCompleted(gid, uid2, name2) {
      let j; try { j = await api('GET', `/api/guilds/${gid}/completions?user=${uid2}`); } catch (e) { return toast(t(e.message)); }
      const fmt = ts => new Date(ts).toLocaleDateString(LOC(), { day: 'numeric', month: 'short', year: 'numeric' });
      M(`<h3>✅ ${t('Completed quests of {n}', { n: esc(name2) })}</h3>${j.items.length ? j.items.map(i => `<div class="q" style="margin-bottom:8px"><div style="font-weight:800">${esc(i.title)}</div><div class="hint" style="margin:2px 0 0">${esc(i.bname || '')} · ${fmt(i.ts)}</div></div>`).join('') : `<p class="hint">${t('Nothing completed yet.')}</p>`}
        <div class="foot"><button class="btn sec" data-g="board" data-id="${gid}">${t('Back')}</button></div>`);
    }
    async function share(cid) {
      try { await refreshGuilds(); } catch (e) { return toast(t(e.message)); }
      const c = cat(cid); if (!c) return;
      const back = `<div class="foot"><button class="btn sec" data-a="editcat" data-c="${cid}">${t('Back')}</button></div>`;
      modal(`<h3>🛡️ ${c.sid ? t('Shared quest board') : t('Share quest board')}</h3>${c.sid
        ? `<p>${t('Shared with {g}', { g: esc(name(c.gid)) })}</p>${canUnshare(c) ? `<button class="btn solid full" data-g="unshare" data-c="${cid}">${t('Stop sharing')}</button>` : ''}`
        : guilds.length
          ? `<p class="hint">${t('Pick a guild to share this quest board with. Everyone in the guild can add, edit and finish its quests.')}</p>${!guilds.some(g => g.can_board) ? `<p>${t('Only guild admins can share quest boards here.')}</p>` : ''}${guilds.filter(g => g.can_board).map(g => `<button class="btn sec full" style="margin-bottom:8px" data-g="shareto" data-c="${cid}" data-id="${g.id}">🛡️ ${t('Share with {g}', { g: esc(g.name) })}</button>`).join('')}`
          : `<p>${t('Create or join a guild first.')}</p><button class="btn full" data-g="open">🛡️ ${t('Guilds')}</button>`}${back}`);
    }
    async function shareTo(cid, gid) {
      const c = cat(cid); if (!c) return;
      stampAll(); c.u = Date.now();
      const r = await api('POST', '/api/boards', { guild_id: gid, board: serial(c) });
      Object.assign(c, { sid: r.id, gid, own: me.id }); apply(c, r.board); pushed[c.sid] = JSON.stringify(serial(c));
      save(); render(); toast(t('Quest board shared.')); share(cid);
    }
    async function unshare(cid) {
      const c = cat(cid); if (!c || !c.sid) return;
      await api('DELETE', '/api/boards/' + c.sid);
      for (const k of ['sid', 'gid', 'own', 'u', 'del']) delete c[k]; delete snaps[c.id];
      save(); render(); toast(t('Sharing stopped.')); share(cid);
    }
    const onDelete = c => { // called when a shared board is deleted locally
      S.hide = S.hide || {};
      if (canUnshare(c)) api('DELETE', '/api/boards/' + c.sid).catch(() => {}); else S.hide[c.sid] = 1;
    };
    const deleteText = c => t(canUnshare(c) ? 'This quest board is shared with {g}. If you delete it, sharing ends and other members keep their own copies.' : 'This quest board is shared with {g}. It will only be removed for you.', { g: esc(name(c.gid)) });
    async function sync() { if (await pull()) { save(); render(); } }

    document.addEventListener('click', async e => {
      const el = e.target.closest('[data-g]'); if (!el) return;
      const a = el.dataset.g, D = el.dataset;
      try {
        if (a === 'create') { await api('POST', '/api/guilds', { name: $('gn').value }); toast(t('Guild created.')); await open(); }
        else if (a === 'join') { const g = (await api('POST', '/api/guilds/join', { code: $('gj').value })).guild; toast(t('You joined {g}.', { g: g.name })); await refreshGuilds(); await sync(); await open(); }
        else if (a === 'copy') { try { await navigator.clipboard.writeText(D.c); } catch (x) {} toast(t('Code copied.')); }
        else if (a === 'newcode') { await api('POST', `/api/guilds/${D.id}/code`); D.back ? await leaderboard(+D.id) : await open(); }
        else if (a === 'kick') { await api('POST', `/api/guilds/${D.id}/kick`, { user_id: +D.u }); D.back ? await leaderboard(+D.id) : await open(); }
        else if (a === 'askok') { const f = askCb; askCb = null; if (f) await f(); }
        else if (a === 'leave') ask(t('Leave guild?'), t('You will keep copies of the shared quest boards.'), t('Leave guild'), async () => { await api('POST', `/api/guilds/${D.id}/leave`); toast(t('You left the guild.')); await refreshGuilds(); await sync(); await open(); });
        else if (a === 'delg') ask(t('Delete guild?'), t('The guild and its shared quest boards will be removed for everyone. Members keep their own copies.'), t('Delete guild'), async () => { await api('DELETE', `/api/guilds/${D.id}`); await refreshGuilds(); await sync(); await open(); });
        else if (a === 'open') await open();
        else if (a === 'page') await guildPage(+D.id);
        else if (a === 'gopts') guildOptions(+D.id);
        else if (a === 'ghist') await guildHistory(+D.id);
        else if (a === 'editstyle') editStyle(+D.id);
        else if (a === 'joinform') joinForm();
        else if (a === 'createform') createForm();
        else if (a === 'demofriends') { IkanDemo.addFriends(+D.id); toast(t('Demo friends added.')); await leaderboard(+D.id); }
        else if (a === 'board') await leaderboard(+D.id);
        else if (a === 'ucomp') await userCompleted(+D.id, +D.u, D.n);
        else if (a === 'shareto') await shareTo(D.c, +D.id);
        else if (a === 'unshare') await unshare(D.c);
      } catch (x) { toast(t(x.message)); }
    });
    window.IkanGuilds = { open, share, name, onDelete, deleteText, sync, onDone, onUndo, saveStyle };
    return { init, pull, push, stampAll, resnapAll, reset, sync };
  })();

  const menu = () => modal(`<h3>⚙️ ${t('Account settings')}</h3><div class="foot" style="flex-direction:column">${me.admin ? `<div class="hint" style="margin:0;text-align:start">${t('Admin options')}</div><button class="btn sec" data-s="users">${t('Manage users')}</button><div class="hint" style="margin:8px 0 0;text-align:start">${t('Account')}</div>` : ''}<button class="btn sec" data-s="pwform">${t('Change password')}</button><button class="btn solid" data-s="logout">${t('Sign out')}</button><button class="btn sec" data-a="profile">${t('Back')}</button></div>`);
  async function usersModal(msg) {
    const L = (await api('GET', '/api/users')).users;
    modal(`<h3>${t('Users')}</h3>${L.map(u => `<div class="q" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:8px"><b style="flex:1">${esc(u.name)}${u.admin ? ' · ' + t('Admin') : ''}</b>${u.id === me.id ? '' : `<button class="btn sec" data-s="pw" data-id="${u.id}">${t('Password')}</button><button class="btn sec red" data-s="del" data-id="${u.id}" data-n="${esc(u.name)}">${t('Delete')}</button>`}</div>`).join('')}
      <label class="l" for="nu">${t('New user')}</label><input type="text" id="nu" maxlength="32" placeholder="${t('Name')}" autocomplete="off"><div style="height:8px"></div><input type="password" id="np" placeholder="${t('Password (min. 6 characters)')}" autocomplete="new-password">
      <p class="hint" id="um" style="margin:8px 0 0">${esc(msg || '')}</p>
      <div class="foot"><button class="btn sec" data-a="close">${t('Close')}</button><button class="btn" data-s="add">${t('Add')}</button></div>`);
  }
  const pwForm = () => modal(`<h3>${t('Change password')}</h3><label class="l" for="pc">${t('Current password')}</label><input type="password" id="pc" autocomplete="current-password"><label class="l" for="pn">${t('New password')}</label><input type="password" id="pn" autocomplete="new-password"><p class="hint" id="pm" style="margin:8px 0 0"></p><div class="foot"><button class="btn sec" data-a="close">${t('Cancel')}</button><button class="btn" data-s="pwsave">${t('Save')}</button></div>`);

  document.addEventListener('click', async e => {
    const el = e.target.closest('[data-s]'); if (!el) return;
    const a = el.dataset.s, D = el.dataset;
    try {
      if (a === 'user' || a === 'acct') menu();
      else if (a === 'logout') { try { await api('POST', '/api/logout') } catch (x) {} closeTop(); out(); }
      else if (a === 'users') await usersModal();
      else if (a === 'add') { await api('POST', '/api/users', { name: $('nu').value.trim(), password: $('np').value }); await usersModal(t('User created.')); }
      else if (a === 'pw') { const p = prompt(t('New password (min. 6 characters):')); if (p) { await api('POST', `/api/users/${D.id}/password`, { password: p }); await usersModal(t('Password changed.')); } }
      else if (a === 'del') { if (confirm(t('Delete user “{n}” and all their data?', { n: D.n }))) { await api('DELETE', `/api/users/${D.id}`); await usersModal(t('User deleted.')); } }
      else if (a === 'pwform') pwForm();
      else if (a === 'pwsave') { await api('POST', '/api/me/password', { current: $('pc').value, password: $('pn').value }); closeTop(); toast(t('Password changed.')); }
    } catch (x) { const m = $('um') || $('pm'); if (m) m.textContent = t(x.message); else toast(t(x.message)); }
  });

  window.onLang = () => {
    if (ov.style.display === 'flex' && authState) showAuth(...authState);
  };
  gate();
})();
