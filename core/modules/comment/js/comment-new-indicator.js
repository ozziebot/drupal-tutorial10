/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/

(function ($, Drupal, window) {
  function processCommentNewIndicators(placeholders) {
    var isFirstNewComment = true;
    var newCommentString = Drupal.t('new');
    var $placeholder;
    placeholders.forEach(function (placeholder) {
      $placeholder = $(placeholder);
      var timestamp = parseInt($placeholder.attr('data-comment-timestamp'), 10);
      var $node = $placeholder.closest('[data-history-node-id]');
      var nodeID = $node.attr('data-history-node-id');
      var lastViewTimestamp = Drupal.history.getLastRead(nodeID);

      if (timestamp > lastViewTimestamp) {
        var $comment = $(placeholder).removeClass('hidden').text(newCommentString).closest('.js-comment').addClass('new');

        if (isFirstNewComment) {
          isFirstNewComment = false;
          $comment.prev().before('<a id="new"></a>');

          if (window.location.hash === '#new') {
            window.scrollTo(0, $comment.offset().top - Drupal.displace.offsets.top);
          }
        }
      }
    });
  }

  Drupal.behaviors.commentNewIndicator = {
    attach: function attach(context) {
      var nodeIDs = [];
      var placeholders = once('history', '[data-comment-timestamp]', context).filter(function (placeholder) {
        var $placeholder = $(placeholder);
        var commentTimestamp = parseInt($placeholder.attr('data-comment-timestamp'), 10);
        var nodeID = $placeholder.closest('[data-history-node-id]').attr('data-history-node-id');

        if (Drupal.history.needsServerCheck(nodeID, commentTimestamp)) {
          nodeIDs.push(nodeID);
          return true;
        }

        return false;
      });

      if (placeholders.length === 0) {
        return;
      }

      Drupal.history.fetchTimestamps(nodeIDs, function () {
        processCommentNewIndicators(placeholders);
      });
    }
  };
})(jQuery, Drupal, window);