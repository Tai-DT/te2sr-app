// ══════════════════════════════════════════════════════════════
//  Thông báo lỗi đa ngôn ngữ
//
//  Máy chủ trước đây chỉ trả tiếng Việt, nên khách quốc tế gặp lỗi là thấy
//  một câu họ không đọc được. Frontend hiển thị thẳng `error` từ API ở rất
//  nhiều nơi, nên dịch ở phía máy chủ theo header `X-Lang` là cách ít rủi ro
//  nhất: không phải sửa từng chỗ hiển thị.
//
//  Ngôn ngữ nào thiếu câu nào thì tự lùi về tiếng Anh, rồi tiếng Việt.
// ══════════════════════════════════════════════════════════════

export type Lang = 'vi' | 'en' | 'ja' | 'ko' | 'fr' | 'de' | 'es' | 'zh';

const SUPPORTED: Lang[] = ['vi', 'en', 'ja', 'ko', 'fr', 'de', 'es', 'zh'];

/** Đọc ngôn ngữ khách đang xem. Không hợp lệ hoặc thiếu thì dùng tiếng Việt. */
export function langOf(header: string | undefined | null): Lang {
  const code = (header || '').trim().toLowerCase().slice(0, 2) as Lang;
  return SUPPORTED.includes(code) ? code : 'vi';
}

export type MsgKey = keyof typeof MESSAGES;

const MESSAGES = {
  // ── Đăng ký / đăng nhập ──
  missing_name_email_password: {
    vi: 'Thiếu họ tên, email hoặc mật khẩu.',
    en: 'Name, email and password are all required.',
    ja: '氏名・メールアドレス・パスワードをすべて入力してください。',
    ko: '이름, 이메일, 비밀번호를 모두 입력해 주세요.',
    fr: 'Le nom, l’e-mail et le mot de passe sont obligatoires.',
    de: 'Name, E-Mail und Passwort sind erforderlich.',
    es: 'Se requieren nombre, correo electrónico y contraseña.',
    zh: '请填写姓名、邮箱和密码。',
  },
  missing_email_password: {
    vi: 'Thiếu email hoặc mật khẩu.',
    en: 'Email and password are required.',
    ja: 'メールアドレスとパスワードを入力してください。',
    ko: '이메일과 비밀번호를 입력해 주세요.',
    fr: 'L’e-mail et le mot de passe sont obligatoires.',
    de: 'E-Mail und Passwort sind erforderlich.',
    es: 'Se requieren correo electrónico y contraseña.',
    zh: '请填写邮箱和密码。',
  },
  invalid_email: {
    vi: 'Email không hợp lệ.',
    en: 'That email address is not valid.',
    ja: 'メールアドレスの形式が正しくありません。',
    ko: '올바른 이메일 주소가 아닙니다.',
    fr: 'Cette adresse e-mail n’est pas valide.',
    de: 'Diese E-Mail-Adresse ist ungültig.',
    es: 'Esa dirección de correo no es válida.',
    zh: '邮箱地址无效。',
  },
  password_too_short: {
    vi: 'Mật khẩu tối thiểu 6 ký tự.',
    en: 'Password must be at least 6 characters.',
    ja: 'パスワードは6文字以上で入力してください。',
    ko: '비밀번호는 6자 이상이어야 합니다.',
    fr: 'Le mot de passe doit contenir au moins 6 caractères.',
    de: 'Das Passwort muss mindestens 6 Zeichen lang sein.',
    es: 'La contraseña debe tener al menos 6 caracteres.',
    zh: '密码至少需要 6 个字符。',
  },
  new_password_too_short: {
    vi: 'Mật khẩu mới tối thiểu 6 ký tự.',
    en: 'The new password must be at least 6 characters.',
    ja: '新しいパスワードは6文字以上で入力してください。',
    ko: '새 비밀번호는 6자 이상이어야 합니다.',
    fr: 'Le nouveau mot de passe doit contenir au moins 6 caractères.',
    de: 'Das neue Passwort muss mindestens 6 Zeichen lang sein.',
    es: 'La nueva contraseña debe tener al menos 6 caracteres.',
    zh: '新密码至少需要 6 个字符。',
  },
  email_taken: {
    vi: 'Email đã được đăng ký. Vui lòng đăng nhập.',
    en: 'That email is already registered. Please sign in instead.',
    ja: 'このメールアドレスは登録済みです。ログインしてください。',
    ko: '이미 가입된 이메일입니다. 로그인해 주세요.',
    fr: 'Cet e-mail est déjà enregistré. Veuillez vous connecter.',
    de: 'Diese E-Mail ist bereits registriert. Bitte melden Sie sich an.',
    es: 'Ese correo ya está registrado. Inicia sesión.',
    zh: '该邮箱已注册，请直接登录。',
  },
  admin_must_use_google: {
    vi: 'Địa chỉ email này là tài khoản quản trị. Vui lòng đăng nhập bằng Google.',
    en: 'This address belongs to an administrator account. Please sign in with Google.',
    ja: 'このアドレスは管理者アカウントです。Googleでログインしてください。',
    ko: '이 주소는 관리자 계정입니다. Google로 로그인해 주세요.',
    fr: 'Cette adresse correspond à un compte administrateur. Connectez-vous avec Google.',
    de: 'Diese Adresse gehört zu einem Administratorkonto. Bitte melden Sie sich mit Google an.',
    es: 'Esta dirección pertenece a una cuenta de administrador. Inicia sesión con Google.',
    zh: '该邮箱是管理员账户，请使用 Google 登录。',
  },
  bad_credentials: {
    vi: 'Email hoặc mật khẩu không đúng.',
    en: 'Incorrect email or password.',
    ja: 'メールアドレスまたはパスワードが正しくありません。',
    ko: '이메일 또는 비밀번호가 올바르지 않습니다.',
    fr: 'E-mail ou mot de passe incorrect.',
    de: 'E-Mail oder Passwort ist falsch.',
    es: 'Correo o contraseña incorrectos.',
    zh: '邮箱或密码不正确。',
  },
  wrong_current_password: {
    vi: 'Mật khẩu hiện tại không đúng.',
    en: 'Your current password is incorrect.',
    ja: '現在のパスワードが正しくありません。',
    ko: '현재 비밀번호가 올바르지 않습니다.',
    fr: 'Votre mot de passe actuel est incorrect.',
    de: 'Ihr aktuelles Passwort ist falsch.',
    es: 'Tu contraseña actual es incorrecta.',
    zh: '当前密码不正确。',
  },
  register_failed: {
    vi: 'Đăng ký thất bại.',
    en: 'Sign-up failed. Please try again.',
    ja: '登録に失敗しました。もう一度お試しください。',
    ko: '가입에 실패했습니다. 다시 시도해 주세요.',
    fr: 'L’inscription a échoué. Veuillez réessayer.',
    de: 'Die Registrierung ist fehlgeschlagen. Bitte erneut versuchen.',
    es: 'No se pudo completar el registro. Inténtalo de nuevo.',
    zh: '注册失败，请重试。',
  },
  login_failed: {
    vi: 'Đăng nhập thất bại.',
    en: 'Sign-in failed. Please try again.',
    ja: 'ログインに失敗しました。もう一度お試しください。',
    ko: '로그인에 실패했습니다. 다시 시도해 주세요.',
    fr: 'La connexion a échoué. Veuillez réessayer.',
    de: 'Die Anmeldung ist fehlgeschlagen. Bitte erneut versuchen.',
    es: 'No se pudo iniciar sesión. Inténtalo de nuevo.',
    zh: '登录失败，请重试。',
  },
  change_password_failed: {
    vi: 'Đổi mật khẩu thất bại.',
    en: 'Could not change your password. Please try again.',
    ja: 'パスワードを変更できませんでした。もう一度お試しください。',
    ko: '비밀번호를 변경하지 못했습니다. 다시 시도해 주세요.',
    fr: 'Impossible de modifier le mot de passe. Veuillez réessayer.',
    de: 'Das Passwort konnte nicht geändert werden. Bitte erneut versuchen.',
    es: 'No se pudo cambiar la contraseña. Inténtalo de nuevo.',
    zh: '修改密码失败，请重试。',
  },

  // ── Google ──
  missing_google_credential: {
    vi: 'Thiếu Google credential (id_token).',
    en: 'The Google credential (id_token) is missing.',
    ja: 'Google の認証情報（id_token）がありません。',
    ko: 'Google 인증 정보(id_token)가 없습니다.',
    fr: 'Le justificatif Google (id_token) est absent.',
    de: 'Die Google-Anmeldedaten (id_token) fehlen.',
    es: 'Falta la credencial de Google (id_token).',
    zh: '缺少 Google 凭证（id_token）。',
  },
  google_verify_failed: {
    vi: 'Lỗi xác thực Google.',
    en: 'Google could not verify that sign-in.',
    ja: 'Google の認証に失敗しました。',
    ko: 'Google 인증에 실패했습니다.',
    fr: 'Google n’a pas pu valider cette connexion.',
    de: 'Google konnte diese Anmeldung nicht bestätigen.',
    es: 'Google no pudo verificar ese inicio de sesión.',
    zh: 'Google 验证失败。',
  },
  google_client_mismatch: {
    vi: 'Google client id không khớp.',
    en: 'The Google client id does not match.',
    ja: 'Google のクライアント ID が一致しません。',
    ko: 'Google 클라이언트 ID가 일치하지 않습니다.',
    fr: 'L’identifiant client Google ne correspond pas.',
    de: 'Die Google-Client-ID stimmt nicht überein.',
    es: 'El id de cliente de Google no coincide.',
    zh: 'Google 客户端 ID 不匹配。',
  },
  google_no_email: {
    vi: 'Không lấy được email từ Google.',
    en: 'Google did not return an email address.',
    ja: 'Google からメールアドレスを取得できませんでした。',
    ko: 'Google에서 이메일 주소를 가져오지 못했습니다.',
    fr: 'Google n’a pas renvoyé d’adresse e-mail.',
    de: 'Google hat keine E-Mail-Adresse zurückgegeben.',
    es: 'Google no devolvió ninguna dirección de correo.',
    zh: '未能从 Google 获取邮箱地址。',
  },
  google_auth_failed: {
    vi: 'Xác thực Google thất bại.',
    en: 'Google sign-in failed. Please try again.',
    ja: 'Google ログインに失敗しました。もう一度お試しください。',
    ko: 'Google 로그인에 실패했습니다. 다시 시도해 주세요.',
    fr: 'La connexion Google a échoué. Veuillez réessayer.',
    de: 'Die Google-Anmeldung ist fehlgeschlagen. Bitte erneut versuchen.',
    es: 'El inicio de sesión con Google falló. Inténtalo de nuevo.',
    zh: 'Google 登录失败，请重试。',
  },

  // ── Quyền ──
  auth_required: {
    vi: 'Yêu cầu đăng nhập.',
    en: 'Please sign in to continue.',
    ja: 'ログインが必要です。',
    ko: '로그인이 필요합니다.',
    fr: 'Veuillez vous connecter pour continuer.',
    de: 'Bitte melden Sie sich an, um fortzufahren.',
    es: 'Inicia sesión para continuar.',
    zh: '请先登录。',
  },
  session_invalid: {
    vi: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.',
    en: 'Your session is invalid or has expired.',
    ja: 'セッションが無効か、有効期限が切れています。',
    ko: '세션이 유효하지 않거나 만료되었습니다.',
    fr: 'Votre session est invalide ou a expiré.',
    de: 'Ihre Sitzung ist ungültig oder abgelaufen.',
    es: 'Tu sesión no es válida o ha caducado.',
    zh: '登录状态无效或已过期。',
  },
  admin_only: {
    vi: 'Chỉ quản trị viên mới có quyền này.',
    en: 'This action is restricted to administrators.',
    ja: 'この操作は管理者のみ実行できます。',
    ko: '이 작업은 관리자만 수행할 수 있습니다.',
    fr: 'Cette action est réservée aux administrateurs.',
    de: 'Diese Aktion ist Administratoren vorbehalten.',
    es: 'Esta acción está restringida a administradores.',
    zh: '此操作仅限管理员。',
  },
  forbidden: {
    vi: 'Không có quyền.',
    en: 'You do not have permission to do that.',
    ja: '権限がありません。',
    ko: '권한이 없습니다.',
    fr: 'Vous n’avez pas l’autorisation nécessaire.',
    de: 'Sie haben dafür keine Berechtigung.',
    es: 'No tienes permiso para hacer eso.',
    zh: '没有权限。',
  },
  order_forbidden: {
    vi: 'Không có quyền truy cập đơn này.',
    en: 'You do not have access to this order.',
    ja: 'この注文にアクセスする権限がありません。',
    ko: '이 주문에 접근할 권한이 없습니다.',
    fr: 'Vous n’avez pas accès à cette commande.',
    de: 'Sie haben keinen Zugriff auf diese Bestellung.',
    es: 'No tienes acceso a este pedido.',
    zh: '您无权访问该订单。',
  },
  user_not_found: {
    vi: 'Không tìm thấy người dùng.',
    en: 'That account could not be found.',
    ja: 'ユーザーが見つかりません。',
    ko: '사용자를 찾을 수 없습니다.',
    fr: 'Ce compte est introuvable.',
    de: 'Dieses Konto wurde nicht gefunden.',
    es: 'No se encontró esa cuenta.',
    zh: '未找到该用户。',
  },

  // ── Đơn hàng ──
  order_missing_fields: {
    vi: 'Cần tên app và email liên hệ.',
    en: 'App name and contact email are required.',
    ja: 'アプリ名と連絡先メールアドレスが必要です。',
    ko: '앱 이름과 연락용 이메일이 필요합니다.',
    fr: 'Le nom de l’application et l’e-mail de contact sont obligatoires.',
    de: 'App-Name und Kontakt-E-Mail sind erforderlich.',
    es: 'Se requieren el nombre de la app y un correo de contacto.',
    zh: '需要填写应用名称和联系邮箱。',
  },
  order_invalid_email: {
    vi: 'Email liên hệ không hợp lệ.',
    en: 'The contact email is not valid.',
    ja: '連絡先メールアドレスの形式が正しくありません。',
    ko: '연락용 이메일이 올바르지 않습니다.',
    fr: 'L’e-mail de contact n’est pas valide.',
    de: 'Die Kontakt-E-Mail-Adresse ist ungültig.',
    es: 'El correo de contacto no es válido.',
    zh: '联系邮箱无效。',
  },
  order_not_found: {
    vi: 'Không tìm thấy đơn hàng.',
    en: 'Order not found.',
    ja: '注文が見つかりません。',
    ko: '주문을 찾을 수 없습니다.',
    fr: 'Commande introuvable.',
    de: 'Bestellung nicht gefunden.',
    es: 'Pedido no encontrado.',
    zh: '未找到订单。',
  },
  order_create_failed: {
    vi: 'Tạo đơn hàng thất bại.',
    en: 'Could not create the order. Please try again.',
    ja: '注文を作成できませんでした。もう一度お試しください。',
    ko: '주문을 생성하지 못했습니다. 다시 시도해 주세요.',
    fr: 'Impossible de créer la commande. Veuillez réessayer.',
    de: 'Die Bestellung konnte nicht erstellt werden. Bitte erneut versuchen.',
    es: 'No se pudo crear el pedido. Inténtalo de nuevo.',
    zh: '创建订单失败，请重试。',
  },
  invalid_status: {
    vi: 'Trạng thái không hợp lệ.',
    en: 'That status is not valid.',
    ja: 'ステータスが正しくありません。',
    ko: '올바르지 않은 상태입니다.',
    fr: 'Ce statut n’est pas valide.',
    de: 'Dieser Status ist ungültig.',
    es: 'Ese estado no es válido.',
    zh: '状态无效。',
  },
  status_update_failed: {
    vi: 'Cập nhật trạng thái thất bại.',
    en: 'Could not update the status. Please try again.',
    ja: 'ステータスを更新できませんでした。もう一度お試しください。',
    ko: '상태를 변경하지 못했습니다. 다시 시도해 주세요.',
    fr: 'Impossible de mettre à jour le statut. Veuillez réessayer.',
    de: 'Der Status konnte nicht aktualisiert werden. Bitte erneut versuchen.',
    es: 'No se pudo actualizar el estado. Inténtalo de nuevo.',
    zh: '更新状态失败，请重试。',
  },
  invalid_payment_field: {
    vi: 'Trường thanh toán không hợp lệ.',
    en: 'That payment field is not valid.',
    ja: '支払い項目が正しくありません。',
    ko: '결제 항목이 올바르지 않습니다.',
    fr: 'Ce champ de paiement n’est pas valide.',
    de: 'Dieses Zahlungsfeld ist ungültig.',
    es: 'Ese campo de pago no es válido.',
    zh: '付款字段无效。',
  },
  payment_update_failed: {
    vi: 'Cập nhật thanh toán thất bại.',
    en: 'Could not update the payment. Please try again.',
    ja: '支払い情報を更新できませんでした。もう一度お試しください。',
    ko: '결제 정보를 변경하지 못했습니다. 다시 시도해 주세요.',
    fr: 'Impossible de mettre à jour le paiement. Veuillez réessayer.',
    de: 'Die Zahlung konnte nicht aktualisiert werden. Bitte erneut versuchen.',
    es: 'No se pudo actualizar el pago. Inténtalo de nuevo.',
    zh: '更新付款失败，请重试。',
  },
  invalid_action: {
    vi: 'Hành động không hợp lệ.',
    en: 'That action is not valid.',
    ja: '操作が正しくありません。',
    ko: '올바르지 않은 작업입니다.',
    fr: 'Cette action n’est pas valide.',
    de: 'Diese Aktion ist ungültig.',
    es: 'Esa acción no es válida.',
    zh: '操作无效。',
  },
  timer_update_failed: {
    vi: 'Cập nhật bộ đếm thất bại.',
    en: 'Could not update the countdown. Please try again.',
    ja: 'カウントダウンを更新できませんでした。もう一度お試しください。',
    ko: '카운트다운을 변경하지 못했습니다. 다시 시도해 주세요.',
    fr: 'Impossible de mettre à jour le compte à rebours. Veuillez réessayer.',
    de: 'Der Countdown konnte nicht aktualisiert werden. Bitte erneut versuchen.',
    es: 'No se pudo actualizar la cuenta atrás. Inténtalo de nuevo.',
    zh: '更新倒计时失败，请重试。',
  },

  // ── Tin nhắn ──
  empty_message: {
    vi: 'Nội dung tin nhắn trống.',
    en: 'The message is empty.',
    ja: 'メッセージが空です。',
    ko: '메시지 내용이 비어 있습니다.',
    fr: 'Le message est vide.',
    de: 'Die Nachricht ist leer.',
    es: 'El mensaje está vacío.',
    zh: '消息内容为空。',
  },
  send_message_failed: {
    vi: 'Gửi tin nhắn thất bại.',
    en: 'Could not send the message. Please try again.',
    ja: 'メッセージを送信できませんでした。もう一度お試しください。',
    ko: '메시지를 보내지 못했습니다. 다시 시도해 주세요.',
    fr: 'Impossible d’envoyer le message. Veuillez réessayer.',
    de: 'Die Nachricht konnte nicht gesendet werden. Bitte erneut versuchen.',
    es: 'No se pudo enviar el mensaje. Inténtalo de nuevo.',
    zh: '发送消息失败，请重试。',
  },

  // ── Khác ──
  analyze_failed: {
    vi: 'Phân tích thiết kế thất bại.',
    en: 'The design analysis failed. Please try again.',
    ja: 'デザイン分析に失敗しました。もう一度お試しください。',
    ko: '디자인 분석에 실패했습니다. 다시 시도해 주세요.',
    fr: 'L’analyse du design a échoué. Veuillez réessayer.',
    de: 'Die Design-Analyse ist fehlgeschlagen. Bitte erneut versuchen.',
    es: 'El análisis de diseño falló. Inténtalo de nuevo.',
    zh: '设计分析失败，请重试。',
  },
  not_found: {
    vi: 'Endpoint không tồn tại.',
    en: 'That endpoint does not exist.',
    ja: 'このエンドポイントは存在しません。',
    ko: '해당 엔드포인트가 존재하지 않습니다.',
    fr: 'Ce point de terminaison n’existe pas.',
    de: 'Dieser Endpunkt existiert nicht.',
    es: 'Ese endpoint no existe.',
    zh: '该接口不存在。',
  },
  internal_error: {
    vi: 'Lỗi máy chủ nội bộ.',
    en: 'Internal server error.',
    ja: 'サーバー内部エラーが発生しました。',
    ko: '서버 내부 오류가 발생했습니다.',
    fr: 'Erreur interne du serveur.',
    de: 'Interner Serverfehler.',
    es: 'Error interno del servidor.',
    zh: '服务器内部错误。',
  },
  too_many_auth: {
    vi: 'Bạn thao tác quá nhanh. Vui lòng thử lại sau 1 phút.',
    en: 'Too many attempts. Please wait a minute and try again.',
    ja: '試行回数が多すぎます。1分ほど待ってからお試しください。',
    ko: '시도가 너무 많습니다. 1분 후에 다시 시도해 주세요.',
    fr: 'Trop de tentatives. Patientez une minute puis réessayez.',
    de: 'Zu viele Versuche. Bitte warten Sie eine Minute.',
    es: 'Demasiados intentos. Espera un minuto e inténtalo de nuevo.',
    zh: '尝试次数过多，请稍等 1 分钟后重试。',
  },
  too_many_orders: {
    vi: 'Bạn vừa gửi quá nhiều yêu cầu. Vui lòng đợi 1 phút rồi thử lại.',
    en: 'Too many requests just now. Please wait a minute and try again.',
    ja: 'リクエストが多すぎます。1分ほど待ってからお試しください。',
    ko: '요청이 너무 많습니다. 1분 후에 다시 시도해 주세요.',
    fr: 'Trop de demandes envoyées. Patientez une minute puis réessayez.',
    de: 'Zu viele Anfragen. Bitte warten Sie eine Minute.',
    es: 'Demasiadas solicitudes. Espera un minuto e inténtalo de nuevo.',
    zh: '请求过于频繁，请稍等 1 分钟后重试。',
  },
} as const;

/** Câu thông báo theo ngôn ngữ, lùi về tiếng Anh rồi tiếng Việt nếu thiếu. */
export function msg(key: MsgKey, lang: Lang): string {
  const entry = MESSAGES[key] as Record<string, string>;
  return entry[lang] || entry.en || entry.vi;
}

/**
 * Lấy thông báo theo ngôn ngữ khách đang xem. Nhận kiểu cấu trúc thay vì
 * Context của Hono để cả index.ts lẫn auth.ts dùng được mà không vòng import.
 */
export function M(c: { req: { header(name: string): string | undefined } }, key: MsgKey): string {
  return msg(key, langOf(c.req.header('X-Lang')));
}
