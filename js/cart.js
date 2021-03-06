"use strict";

jQuery(document).ready(function ($) {

    /* Set rates + misc */
    var taxRate = 0.14;
    var shippingRate = 0;
    var fadeTime = 300;

    /* Assign actions */
    jQuery('.product-quantity input').change(function () {
        updateQuantity(this);
    });

    jQuery('.product-removal button').click(function () {
        removeItem(this);
    });


    /* Recalculate cart */
    function recalculateCart() {
        var subtotal = 0;

        /* Sum up row totals */
        jQuery('.product').each(function () {
            subtotal += parseFloat(jQuery(this).children('.product-line-price').text());
        });


        /* Calculate totals */
        var tax = subtotal * taxRate;
        var shipping = (subtotal > 0 ? shippingRate : 0);
        var total = subtotal + tax + shipping;

        /* Update totals display */
        jQuery('.totals-value').fadeOut(fadeTime, function () {
            jQuery('#cart-subtotal').html(subtotal.toFixed(2));
            jQuery('#cart-tax').html(tax.toFixed(2));
            jQuery('#cart-shipping').html(shipping.toFixed(2));
            jQuery('#cart-total').html(total.toFixed(2));
            if (total === 0) {
                jQuery('.checkout').fadeOut(fadeTime);
            } else {
                jQuery('.checkout').fadeIn(fadeTime);
            }
            jQuery('.totals-value').fadeIn(fadeTime);
        });
    }


    /* Update quantity */
    function updateQuantity(quantityInput) {

        const index = getItemIndex(quantityInput.id);


        /* Calculate line price */
        const itemPriceInput = '#checkout-' + index + '-itemPrice';


        var itemPriceRow = jQuery(quantityInput).parent().parent().parent();
        var productRow = jQuery(quantityInput).parent().parent();

        var price = jQuery(itemPriceInput).val();
        var quantity = jQuery(quantityInput).val();
        var linePrice = price * quantity;

        console.log(itemPriceRow);
        console.log(productRow);
        console.log(linePrice);
        // console.log(quantity);
        /* Update line price display and recalc cart totals */
        productRow.children('.product-line-price').each(function () {
            jQuery(this).fadeOut(fadeTime, function () {
                jQuery(this).text(linePrice.toFixed(2));
                recalculateCart();
                jQuery(this).fadeIn(fadeTime);
            });
        });
    }


    /* Remove item from cart */
    function removeItem(removeButton) {
        /* Remove row from DOM and recalc cart total */
        var productRow = jQuery(removeButton).parent().parent();
        productRow.slideUp(fadeTime, function () {
            productRow.remove();
            recalculateCart();
        });
    }


    function getItemIndex(elementId) {
        if (!isEmpty(elementId)) {
            let matches = elementId.match(/\d+/g);
            return matches[0];
        }
    }

    function isEmpty(val) {
        return (val === undefined || val === null || val.length <= 0);
    }
});

