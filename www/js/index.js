document.addEventListener('deviceready', function () {
    console.log('Cordova está pronto!');

    if (cordova.platformId === 'android') {
        const permissions = cordova.plugins.permissions;

        // Solicita permissão para notificações
        permissions.checkPermission(permissions.POST_NOTIFICATIONS, function (status) {
            if (!status.hasPermission) {
                permissions.requestPermission(permissions.POST_NOTIFICATIONS, function (status) {
                    if (status.hasPermission) {
                        console.log('Permissão de notificação concedida.');
                        // Abrir configurações de otimização de bateria
                        window.plugins.intentShim.startActivity({
                            action: "android.settings.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS",
                            data: "package:" + device.packageName
                        }, function() {
                            console.log("Configuração de economia de bateria aberta com sucesso.");
                        }, function(err) {
                            console.error("Erro ao abrir configurações:", err);
                        });
                    } else {
                        console.warn('Permissão de notificação negada.');
                    }
                }, function (error) {
                    console.error('Erro ao solicitar permissão de notificação:', error);
                });
            } else {
                console.log('Permissão de notificação já concedida.');
            }
        });
    }
}, false);

// Variáveis do cronômetro
let timer = 0;
let interval = null;

// Função para iniciar o cronômetro
function startTimer() {
    if (!interval) {
        // Ativar modo segundo plano
        cordova.plugins.backgroundMode.setDefaults({
            title: 'Cronômetro Ativo',
            text: 'O cronômetro está rodando em segundo plano',
            icon: 'icon', // Nome do ícone na pasta res/drawable
            color: 'F14F4D',
            resume: true,
            hidden: false
        });

        cordova.plugins.backgroundMode.enable();
        cordova.plugins.backgroundMode.on('activate', function () {
            cordova.plugins.backgroundMode.disableWebViewOptimizations();
            console.log('Modo de segundo plano ativado.');
        });

        console.log('Cronômetro iniciado!');
        interval = setInterval(() => {
            timer++;
            document.getElementById('timer').innerText = `${timer} segundos`;
            console.log(`Timer: ${timer} segundos`);
        }, 1000);

        // Ativar serviço em primeiro plano
        if (window.ForegroundService) {
            window.ForegroundService.start(
                "Cronômetro Ativo",
                "O cronômetro está rodando em segundo plano",
                "icon",
                3, // Notificação de prioridade alta
                1000 // Intervalo de atualização em ms
            );
            console.log("Serviço em primeiro plano ativado.");
        } else {
            console.warn("O plugin ForegroundService não está disponível.");
        }
    }
}

// Função para parar o cronômetro
function stopTimer() {
    if (interval) {
        clearInterval(interval);
        interval = null;
        console.log('Cronômetro parado!');
    }

    // Desativar modo segundo plano e serviço em primeiro plano
    cordova.plugins.backgroundMode.disable();
    
    if (window.ForegroundService) {
        window.ForegroundService.stop();
        console.log("Serviço em primeiro plano desativado.");
    }
}


// Agenda notificação em 30s minutos
function agendarNotificacao() {
    cordova.plugins.notification.local.schedule({
        id: 1, // ID único da notificação
        title: "Alerta",
        text: "Alerta 30s após a chamada",
        trigger: { at: new Date(new Date().getTime() + 30 * 1000) }, // 15 minutos no futuro
        foreground: true, // Mostrar notificação se o app estiver aberto
        vibrate: true, // Vibrar ao exibir a notificação
        //sound: "file://sound.mp3"  //Opcional: adicionar um som personalizado
    });

    console.log("Notificação agendada para 15 minutos antes.");
}