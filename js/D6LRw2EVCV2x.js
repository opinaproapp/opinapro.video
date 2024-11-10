$(document).ready(function() {
    // Função para salvar estados nos cookies
    function saveStateToCookies(key, value) {
        Cookies.set(key, value, { expires: 7 }); // Salva por 7 dias
    }

    // Função para carregar estados dos cookies
    function loadStateFromCookies(key) {
        return Cookies.get(key);
    }

    // Interatividade para o botão de like e dislike nos comentários
    $('.like-icon').on('click', function() {
        var commentId = $(this).attr('class').split(' ')[1]; // Obtém o número único do comentário
        var likeCount = parseInt($(this).find('.like_number').text()) || 0;
        var isLiked = $(this).data('liked') || false;
        var dislikeButton = $(`.deslike-icon.${commentId}`);
        
        if (isLiked) {
            // Desfazer like
            $(this).find('.like_number').text(likeCount - 1);
            $(this).css('color', '');
            $(this).data('liked', false);
            saveStateToCookies(`like_status_${commentId}`, 'not_liked');
        } else {
            // Curtir comentário
            $(this).find('.like_number').text(likeCount + 1);
            $(this).css('color', '#198754');
            $(this).data('liked', true);
            saveStateToCookies(`like_status_${commentId}`, 'liked');

            // Se o dislike estiver ativo, desfazê-lo
            dislikeButton.css('color', '');
            dislikeButton.data('disliked', false);
            saveStateToCookies(`dislike_status_${commentId}`, 'not_disliked');
        }
    });

    $('.deslike-icon').on('click', function() {
        var commentId = $(this).attr('class').split(' ')[1]; // Obtém o número único do comentário
        var isDisliked = $(this).data('disliked') || false;
        var likeButton = $(`.like-icon.${commentId}`);

        if (isDisliked) {
            // Desfazer deslike
            $(this).css('color', '');
            $(this).data('disliked', false);
            saveStateToCookies(`dislike_status_${commentId}`, 'not_disliked');
        } else {
            // Dar deslike
            $(this).css('color', '#dc3545');
            $(this).data('disliked', true);
            saveStateToCookies(`dislike_status_${commentId}`, 'disliked');

            // Se o like estiver ativo, desfazê-lo
            var likeCount = parseInt(likeButton.find('.like_number').text()) || 0;
            if (likeButton.data('liked')) {
                likeButton.find('.like_number').text(likeCount - 1);
                likeButton.css('color', '');
                likeButton.data('liked', false);
                saveStateToCookies(`like_status_${commentId}`, 'not_liked');
            }
        }
    });

    // Interatividade para o botão de like geral
    $('.like-buttons .action-button').first().on('click', function() {
        var likes = parseInt($(this).text()) || 0;
        var isLiked = $(this).data('liked') || false;
        var dislikeButton = $('.like-buttons .action-button').last();

        if (isLiked) {
            $(this).html(`<i class="fa fa-thumbs-up"></i> ${likes - 1}`);
            $(this).css('background-color', '');
            $(this).data('liked', false);
            saveStateToCookies('like_status', 'not_liked');
        } else {
            $(this).html(`<i class="fa fa-thumbs-up"></i> ${likes + 1}`);
            $(this).css('background-color', '#198754');
            $(this).data('liked', true);
            saveStateToCookies('like_status', 'liked');
            dislikeButton.css('background-color', '');
            dislikeButton.data('disliked', false);
            saveStateToCookies('dislike_status', 'not_disliked');
        }
    });

    // Interatividade para o botão de deslike geral
    $('.like-buttons .action-button').last().on('click', function() {
        var isDisliked = $(this).data('disliked') || false;
        var likeButton = $('.like-buttons .action-button').first();

        if (isDisliked) {
            $(this).css('background-color', '');
            $(this).data('disliked', false);
            saveStateToCookies('dislike_status', 'not_disliked');
        } else {
            $(this).css('background-color', '#dc3545');
            $(this).data('disliked', true);
            saveStateToCookies('dislike_status', 'disliked');
            likeButton.html(`<i class="fa fa-thumbs-up"></i> ${parseInt(likeButton.text()) - 1}`);
            likeButton.css('background-color', '');
            likeButton.data('liked', false);
            saveStateToCookies('like_status', 'not_liked');
        }
    });

    // Interatividade para o botão de save com toggle
    $('.action-button').eq(3).on('click', function() {
        var isSaved = $(this).data('saved') || false;

        if (isSaved) {
            // Se já estiver salvo, reverte para o estado original
            $(this).html('<i class="fa fa-floppy-o"></i> Save');
            $(this).data('saved', false);
            saveStateToCookies('save_status', 'not_saved');
        } else {
            // Se não estiver salvo, altera para o estado "Saved"
            $(this).html('<i class="fa fa-check"></i> Saved');
            $(this).data('saved', true);
            saveStateToCookies('save_status', 'saved');
        }
    });

    // Interatividade para o botão de subscribe
    $('.subscribe').on('click', function() {
        var isSubscribed = $(this).data('subscribed') || false;

        if (isSubscribed) {
            // Se já estiver inscrito, volta para o estado original (não inscrito)
            $(this).text('Inscrever-se');
            $(this).css({
                'background-color': '#dc3545',
                'color': 'white'
            });
            $(this).data('subscribed', false);
            saveStateToCookies('subscribe_status', 'not_subscribed');
        } else {
            // Se não estiver inscrito, muda para "Inscrito"
            $(this).text('Inscrito').prepend('<i class="fa fa-check"></i> ');
            $(this).css({
                'background-color': 'white',
                'color': 'black'
            });
            $(this).data('subscribed', true);
            saveStateToCookies('subscribe_status', 'subscribed');
        }
    });

    // Função para restaurar o estado dos comentários
    function restoreCommentState() {
        $('.like-icon').each(function() {
            var commentId = $(this).attr('class').split(' ')[1]; // Obtém o número único do comentário
            var likeStatus = loadStateFromCookies(`like_status_${commentId}`);
            var dislikeStatus = loadStateFromCookies(`dislike_status_${commentId}`);
            
            if (likeStatus === 'liked') {
                var likeCount = parseInt($(this).find('.like_number').text()) || 0;
                $(this).find('.like_number').text(likeCount + 1);
                $(this).css('color', '#198754');
                $(this).data('liked', true);
            }

            if (dislikeStatus === 'disliked') {
                var dislikeButton = $(`.deslike-icon.${commentId}`);
                dislikeButton.css('color', '#dc3545');
                dislikeButton.data('disliked', true);
            }
        });
    }

    // Função para restaurar o estado do botão de subscribe
    function restoreSubscribeState() {
        var subscribeStatus = loadStateFromCookies('subscribe_status');
        
        if (subscribeStatus === 'subscribed') {
            $('.subscribe').text('Inscrito').prepend('<i class="fa fa-check"></i> ');
            $('.subscribe').css({
                'background-color': 'white',
                'color': 'black'
            });
            $('.subscribe').data('subscribed', true);
        } else {
            $('.subscribe').text('Inscrever-se');
            $('.subscribe').css({
                'background-color': '#dc3545',
                'color': 'white'
            });
            $('.subscribe').data('subscribed', false);
        }
    }

    // Mostrar conteúdo extra
    $('.show_more').on('click', function() {
        $('.extra_content').slideToggle('fast');
        var state = $(this).text() === 'Ver Mais' ? 'shown' : 'hidden';
        saveStateToCookies('extra_content_status', state);

        // Alterna o texto
        if ($(this).text() === 'Ver Mais') {
            $(this).text('Ver Menos');
        } else {
            $(this).text('Ver Mais');
        }
    });

    // Função para restaurar o estado geral
    function restoreState() {
        // Restaurar o estado do like
        var likeStatus = loadStateFromCookies('like_status');
        if (likeStatus === 'liked') {
            $('.like-buttons .action-button').first().html(`<i class="fa fa-thumbs-up"></i> ${parseInt($('.like-buttons .action-button').first().text()) + 1}`);
            $('.like-buttons .action-button').first().css('background-color', '#198754');
            $('.like-buttons .action-button').first().data('liked', true);
        }

        // Restaurar o estado do dislike
        var dislikeStatus = loadStateFromCookies('dislike_status');
        if (dislikeStatus === 'disliked') {
            $('.like-buttons .action-button').last().css('background-color', '#dc3545');
            $('.like-buttons .action-button').last().data('disliked', true);
        }

        // Restaurar o estado de subscribe
        restoreSubscribeState();

        // Restaurar o estado do botão de save
        var saveStatus = loadStateFromCookies('save_status');
        if (saveStatus === 'saved') {
            $('.action-button').eq(3).html('<i class="fa fa-check"></i> Saved');
            $('.action-button').eq(3).data('saved', true);
        } else {
            $('.action-button').eq(3).html('<i class="fa fa-floppy-o"></i> Save');
            $('.action-button').eq(3).data('saved', false);
        }

        // Restaurar o estado do conteúdo extra
        var extraContentStatus = loadStateFromCookies('extra_content_status');
        if (extraContentStatus === 'shown') {
            $('.extra_content').show();
            $('.show_more').text('Ver Menos');
        }
    }

    // Restaurar estados ao carregar a página
    restoreCommentState();
    restoreState();
});


        // Alternar comentários
        $('.show-more').click(function() {
            // Scroll para o topo antes de abrir o painel de comentários
            $(window).scrollTop(0.0);
            // Verifica se o painel de comentários está visível ou não
            if ($('.comments-panel').is(':visible')) {
                $('.comments-panel').slideUp('fast');
            } else {
                $('.comments-panel').slideDown('fast');
            }
        });

        // Se houver necessidade de um botão específico para fechar
        $('.close-comments').click(function() {
            $('.comments-panel').slideUp('fast');
        });
