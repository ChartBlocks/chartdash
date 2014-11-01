(function($) {

    $.fn.cbDashboard = function() {

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

        function renderBox(box) {
            var $box = $(box);
            var shapeName = $box.attr('data-shape');

            if (shapeName in shapes) {
                var shape = shapes[shapeName];
                $box.removeClass(shapeClasses.join(' '));
                $box.addClass(shape.classes.join(' '));
                maintainShape(box);
            } else {
                console.warn('Unknown shape', shapeName);
            }
        }

        function maintainShape(boxes) {
            var $boxes = $(boxes);
            $boxes.css('height', null);

            $boxes.filter('.square').each(function() {
                var $sq = $(this);
                console.log('sq', $sq.width(), this);
                $sq.height($sq.width());
            });

            $boxes.filter('.rectangle').each(function() {
                var $sq = $(this);
                $sq.height(Math.floor($sq.width() * 0.496));
            });
        }

        var $shapes = this.find("[data-shape]");
        $shapes.each(function() {
            renderBox(this);
        });
        
        maintainShape($shapes);

        $(window).on('resize', function() {
            maintainShape($shapes);
        });

        return this;

    };

}(jQuery));