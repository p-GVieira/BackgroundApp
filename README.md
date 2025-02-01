# BackgroundApp
 [CORDOVA] Aplicativo que roda em segundo plano no android

 Plugins cordova necessários:

 cordova-plugin-android-permissions //Para solicitar a permissão de mostrar notificações
 cordova-plugin-background-mode //Para rodar em segundo plano
 cordova-plugin-foreground-service ou https://github.com/Red-Folder/Cordova-Plugin-BackgroundService //Para rodar em primeiro plano

No android 12+ tem que adicionar o "PendingIntent.FLAG_IMMUTABLE" no arquivo ForegroundService.java e no trecho abaixo:

PendingIntent contentIntent = PendingIntent.getActivity(
    context, NOTIFICATION_ID, intent,
    PendingIntent.FLAG_UPDATE_CURRENT);

Ficando assim:

PendingIntent contentIntent = PendingIntent.getActivity(
    context, NOTIFICATION_ID, intent,
    PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
