(function ($) {

    $.fn.cbDashboardEdit = function () {
        var $dashboard = $(this);

        var templates = {
            'rec-sq': {
                'shapes': ['large-rectangle', 'medium-square']
            },
            'sq-sq-sq': {
                'shapes': ['medium-square', 'medium-square', 'medium-square']
            },
            'lsq-sq-sq': {
                'shapes': ['large-square', 'medium-square', 'medium-square']
            },
            'lrec': {
                'shapes': ['full-rectangle']
            }
        };

        function openEditor(col) {
            var $col = $(col);
            var $raw = $col.find('.raw-content');

            var $modal = $('#columnModal');
            var $textarea = $modal.find('textarea.content');
            var originalContent = $raw.html();

            $modal.unbind('hide.bs.modal').on('hide.bs.modal', function (e) {
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

            $modal.unbind('show.bs.modal').on('show.bs.modal', function (e) {
                $textarea.val(originalContent);

                $modal.find('.save').unbind('click.save').bind('click.save', function () {
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
            $col.removeClass('add');
        }

        function openRowCreator() {
            var $modal = $('#rowModal');

            $modal.unbind('show.bs.modal').on('show.bs.modal', function (e) {
                $modal.find('.layout').unbind('click.insert').bind('click.insert', function () {
                    var $option = $(this);
                    var layout = $option.attr('data-layout');
                    addRow(layout);

                    $modal.modal('hide');
                });
            });

            $modal.modal({
                backdrop: false,
                keyboard: true,
                show: true
            });
        }

        function addRow(templateName) {
            if (templateName in templates) {
                var template = templates[templateName];
                var $row = $('<div class="row" />');
                $row.appendTo($dashboard);

                $(template.shapes).each(function (i, shape) {
                    var $col = $('<div class="col" data-shape="' + shape + '" />')
                            .append('<div class="box" />');

                    $row.append($col);
                    $dashboard.trigger('append', [$col]);
                });
            } else {
                console.warn('Unknown layout', templateName);
            }
        }

        function makeColumnEditable(col) {
            var $col = $(col);
            $col.addClass('editable');
            $col.on('dblclick', function () {
                openEditor(this);
            });
        }

        this.find(".col").each(function () {
            makeColumnEditable(this);
        });

        this.on('add', openRowCreator);
        this.on('append', function (e, col) {
            makeColumnEditable(col);
        });

        return this;

    };

}(jQuery));