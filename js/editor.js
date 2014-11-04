(function ($) {

    $.fn.cbDashboardEdit = function () {
        var $dashboard = $(this);
        var $download = $('.download');

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

                addDeleteOptionToRow($row);
            } else {
                console.warn('Unknown layout', templateName);
            }
        }

        function addDeleteOptionToRow(row) {
            var $row = $(row);
            var html = $('#deleteRowTemplate').html();

            var $delete = $(html);
            $delete.insertAfter($row);

            $delete.on('click', function () {
                if (confirm('Delete entire row?')) {
                    $row.remove();
                    $delete.remove();
                }
            });
        }

        function makeColumnEditable(col) {
            var $col = $(col);
            $col.addClass('editable');
            $col.on('dblclick', function () {
                openEditor(this);
            });
        }

        this.find(".row").each(function () {
            addDeleteOptionToRow(this);
        });

        this.find(".col").each(function () {
            makeColumnEditable(this);
        });

        this.on('add', openRowCreator);
        this.on('append', function (e, col) {
            makeColumnEditable(col);
        });

        $download.on('click', function () {
            var $item = $(this);

            $dashboard.trigger('unrenderAll');

            var html = document.documentElement.outerHTML;
            var bodyTag = html.indexOf('<body');
            var from = html.indexOf("\n", bodyTag);
            var to = html.indexOf('</body', from);

            var body = html.substring(from, to);
            var $body = $('<div>' + body + '</div>');
            $body.find('.editor').remove();

            var base = window.location.href.replace(/\/([^\/]+)?$/, '');
            var output = html.substring(0, from) + $body.html() + html.substring(to);
            output = output.replace(/^(.*)EDITOR\:LINE(.*)$/mg, '');
            output = output.replace(/^([\s\t\n]+)$/mg, '');
            output = output.replace(/(src|href)="(?!http|\/\/)([^"])/g, '$1="' + base + '/$2');

            var body = btoa(output);
            $item.attr('href', 'data:text/html;charset=utf-8;base64,' + body);

            $dashboard.trigger('renderAll');
        });

        return this;

    };

}(jQuery));