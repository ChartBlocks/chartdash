(function($) {

    $.fn.cbDashboardEdit = function() {

        function openEditor(col) {
            var $col = $(col);
            var $raw = $col.find('.raw-content');

            var $modal = $('#columnModal');
            var $textarea = $modal.find('textarea.content');
            var originalContent = $raw.html();

            $modal.unbind('hide.bs.modal').on('hide.bs.modal', function(e) {
                if (originalContent !== $textarea.val()) {
                    var discard = confirm('Discard changes?');
                    if (discard) {
                        updateCol(col, originalContent);
                    } else {
                        e.preventDefault();
                        e.cancel();
                        return false;
                    }
                }
            });

            $modal.unbind('show.bs.modal').on('show.bs.modal', function(e) {
                $textarea.val(originalContent);

                $modal.find('.save').unbind('click.save').bind('click.save', function() {
                    var newContent = originalContent = $textarea.val();
                    updateCol(col, newContent);
                    $modal.modal('hide');
                });
            });

            $modal.modal({
                backdrop: false,
                keyboard: true,
                show: true
            });
        }

        function updateCol(col, content) {
            var $col = $(col);
            var $raw = $col.find('.raw-content');

            $raw.html(content);
            $col.trigger('render');
        }

        this.find(".col").each(function() {
            var $col = $(this);
            $col.addClass('editable');
            $col.on('dblclick', function() {
                openEditor(this);
            });
        });

        return this;

    };

}(jQuery));