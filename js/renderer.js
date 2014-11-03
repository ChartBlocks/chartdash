(function ($) {

    $.embedly.defaults.key = 'fd0ff9f7c2df4c438e361e6c53b4e902';

    $.fn.cbDashboard = function () {

        var shapeClasses = [
            'col-md-4',
            'col-md-8',
            'col-md-12',
            'square',
            'rectangle'
        ];

        var shapes = {
            'medium-square': {
                'classes': ['col-md-4', 'square'],
                'usage': {
                    'width': 4,
                    'height': 6
                }
            },
            'large-square': {
                'classes': ['col-md-8', 'square'],
                'usage': {
                    'width': 8,
                    'height': 12
                }
            },
            'large-rectangle': {
                'classes': ['col-md-8', 'rectangle'],
                'usage': {
                    'width': 8,
                    'height': 12
                }
            },
            'full-square': {
                'classes': ['col-md-12', 'square'],
                'usage': {
                    'width': 12,
                    'height': 12
                }
            },
            'full-rectangle': {
                'classes': ['col-md-12', 'rectangle'],
                'usage': {
                    'width': 12,
                    'height': 12
                }
            }
        };

        function renderBox(col) {
            var $col = $(col);
            var $box = $('.box', $col);
            var shapeName = $col.attr('data-shape');
            console.log('col', $col, shapeName);

            if (shapeName in shapes) {
                var shape = shapes[shapeName];
                $col.removeClass(shapeClasses.join(' '));
                $col.addClass(shape.classes.join(' '));
                maintainShape(col);
            } else {
                console.warn('Unknown shape', shapeName);
            }

            var content = $box.html();
            var $raw = $('<div class="raw-content" />');
            var $rendered = $('<div class="rendered-content" />');

            $box.empty();
            $box.append($raw);
            $box.append($rendered);

            $raw.html(content);

            $col.on('render', function () {
                parseContent(col);
            }).trigger('render');

        }

        function maintainShape(boxes) {
            var $boxes = $(boxes);
            $boxes.css('height', null);

            $boxes.filter('.square').each(function () {
                var $sq = $(this);
                $sq.height($sq.width());
            });

            $boxes.filter('.rectangle').each(function () {
                var $sq = $(this);
                $sq.height(Math.floor($sq.width() * 0.496));
            });
        }

        function parseContent(col) {
            var $col = $(col);
            var $raw = $('.raw-content', col);
            var $rendered = $('.rendered-content', col);

            var raw = $raw.html();
            var html = (raw.length > 0) ? markdown.toHTML(raw) : null;

            $col.toggleClass('empty', (raw.length === 0));
            $rendered.html(html);

            oEmbed($rendered);
        }

        function oEmbed(element) {
            var $element = $(element);
            var content = $element.html();
            var urls = extractUrls(content);

            $.embedly.oembed(urls).done(function (results) {
                $(results).each(function (i, result) {
                    var regex = new RegExp("^(<p>)?" + result.original_url + '(<\/p>)?');

                    switch (result.type) {
                        case 'rich':
                        case 'video':
                            content = content.replace(regex, result.html);
                            break;
                        case 'photo':
                            content = content.replace(regex, "<img style='" + result.style + "' src='" + result.url + "' alt='" + result.title + "' />");
                            break;
                        default:
                            var html = null;
                            html = result.thumbnail_url ? "<img src='" + result.thumbnail_url + "' class='thumb' style='" + result.style + "'/>" : "";
                            html += "<a href='" + result.original_url + "'>" + result.title + "</a>";
                            html += result.provider_name ? "<a href='" + result.provider_url + "' class='provider'>" + result.provider_name + "</a>" : "";
                            html += result.description ? '<div class="description">' + result.description + '</div>' : '';

                            content = content.replace(regex, html);
                    }
                });

                $element.html(content);
            });
        }

        function extractUrls(content) {
            var matches = content.match(/^(<p>)?http([^\s\n<]+)(<\/p>)?/g);

            if (matches) {
                var urls = matches.map(function (url) {
                    return url.replace(/<\/?p>/g, '');
                });

                return urls;
            }

            return null;
        }

        var $shapes = this.find("[data-shape]");
        $shapes.each(function () {
            renderBox(this);
        });

        maintainShape($shapes);

        this.on('append', function (e, col) {
            renderBox(col);
        });

        $(window).on('resize', function () {
            maintainShape($shapes);
        });

        return this;

    };

}(jQuery));