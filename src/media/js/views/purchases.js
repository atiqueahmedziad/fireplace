/*
    My Apps page.
*/
define('views/purchases', ['core/l10n', 'core/urls', 'utils_local'], function(l10n, urls, utilsLocal) {
    'use strict';
    var gettext = l10n.gettext;
    var title = gettext('My Apps');

    return function(builder, args) {
        builder.z('type', 'root settings purchases');
        builder.z('title', title);
        builder.z('parent', urls.reverse('homepage'));
        utilsLocal.headerTitle(title);

        builder.start('purchases.html', {
            endpoint_name: 'installed'
        });
    };
});
