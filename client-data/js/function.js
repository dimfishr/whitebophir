jQuery(function($) {
    

    $('.cor_switcher').on('change', function () {
        if ( $(this).prop('checked') ) {
            $('#root').addClass('dark');
        } else {
            $('#root').removeClass('dark');
        }
    });

    $(document.body).on('click', '.minus, .plus', function() {
        let wrap = $(this).closest('.tool__change');
        let buttonMinus = wrap.find('.minus');
        let buttonPlus = wrap.find('.plus');

        let qty = $(this).parent().find( 'input' );
        let	val = parseInt( qty.val() );
        let	min = parseInt( qty.attr( 'min' ) );
        let	max = parseInt( qty.attr( 'max' ) );
        let	step = parseInt( qty.attr( 'step' ) );

        if ( $( this ).is( '.plus' ) ) {
            if ( max && ( max <= val ) ) {
                qty.val( max );
            } else {
                qty.val( val + step );
            }
        } else {
            if ( min && ( min >= val ) ) {
                qty.val( min );
            } else if ( val > 1 ) {
                qty.val( val - step );
            }
        }

        let quantity = parseInt(qty.val());


        if (quantity == min) {
            buttonMinus.addClass('disabled');
        } else {
            buttonMinus.removeClass('disabled');
        }

        if (quantity == max) {
            buttonPlus.addClass('disabled');
        } else {
            buttonPlus.removeClass('disabled');
        }

        $('.tool__preview span').css({
            "width" : (quantity) + "px",
            "height" : (quantity) + "px",
        });

        $('.tool__opacity i').css({
            "opacity" : (quantity) + "%"
        });

    })

    // $('#chooseColor').click(function(event) {
    //     event.preventDefault();
    // });

});
