<?php

if (!class_exists('SingleTermTaxonomyWalker') && class_exists('Walker')) :

  /**
   * Walker to output an unordered list of taxonomy radio <input> elements.
   *
   * @see Walker
   * @see wp_category_checklist()
   * @see wp_terms_checklist()
   */
  class SingleTermTaxonomyWalker extends Walker {
    public $tree_type = 'category';
    public $db_fields = ['parent' => 'parent', 'id' => 'term_id'];

    public function __construct($hierarchical, $input_element) {
      $this->hierarchical = $hierarchical;
      $this->input_element = $input_element;
    }

    /**
     * Starts the list before the elements are added.
     *
     * @param string $output Passed by reference. Used to append additional content.
     * @param int $depth Depth of category. Used for tab indentation.
     * @param array $args An array of arguments. @see wp_terms_checklist()
     *
     * @see Walker:start_lvl()
     */
    public function start_lvl(&$output, $depth = 0, $args = []) {
      if ('radio' == $this->input_element) {
        $indent = str_repeat("\t", $depth);
        $output .= "$indent<ul class='children'>\n";
      }
    }

    /**
     * Ends the list of after the elements are added.
     *
     * @param string $output Passed by reference. Used to append additional content.
     * @param int $depth Depth of category. Used for tab indentation.
     * @param array $args An array of arguments. @see wp_terms_checklist()
     *
     * @see Walker::end_lvl()
     */
    public function end_lvl(&$output, $depth = 0, $args = []) {
      if ('radio' == $this->input_element) {
        $indent = str_repeat("\t", $depth);
        $output .= "$indent</ul>\n";
      }
    }

    /**
     * Start the element output.
     *
     * @param string $output Passed by reference. Used to append additional content.
     * @param object $term The current term object.
     * @param int $depth Depth of the term in reference to parents. Default 0.
     * @param array $args An array of arguments. @see wp_terms_checklist()
     * @param int $id ID of the current term.
     *
     * @see Walker::start_el()
     */
    public function start_el(&$output, $term, $depth = 0, $args = [], $id = 0) {

      $taxonomy = empty($args['taxonomy']) ? 'category' : $args['taxonomy'];
      $name = $taxonomy == 'category' ? 'post_category' : 'tax_input[' . $taxonomy . ']';
      // input name
      $name = $this->hierarchical ? $name . '[]' : $name;
      // input value
      $value = $this->hierarchical ? $term->term_id : $term->slug;

      $selected_cats = empty($args['selected_cats']) ? [] : $args['selected_cats'];
      $in_selected = in_array($term->term_id, $selected_cats);

      $args = [
        'id' => esc_attr($taxonomy . '-' . $term->term_id),
        'name' => esc_attr($name),
        'value' => esc_attr($value),
        'checked' => checked($in_selected, true, false),
        'selected' => selected($in_selected, true, false),
        'disabled' => disabled(empty($args['disabled']), false, false),
        'label' => esc_html(apply_filters('the_category', $term->name)),
        'depth' => $depth,
      ];

      $output .= 'radio' == $this->input_element
        ? $this->start_el_radio($args)
        : $this->start_el_select($args);
    }

    /**
     * Creates the opening markup for the radio input
     *
     * @param array $args Array of arguments for creating the element
     *
     * @return string Opening li element and radio input
     */
    public function start_el_radio($args) {
      return "\n" . sprintf(
          '<li id="%s"><label class="selectit"><input value="%s" type="radio" name="%s" id="in-%s" %s %s/>%s</label>',
          $args['id'],
          $args['value'],
          $args['name'],
          $args['id'],
          $args['checked'],
          $args['disabled'],
          $args['label']
        );
    }

    /**
     * Creates the opening markup for the select input
     *
     * @param array $args Array of arguments for creating the element
     *
     * @return string Opening option element and option text
     */
    public function start_el_select($args) {
      $pad = str_repeat('&nbsp;', $args['depth'] * 3);

      return "\n" . sprintf(
          '<option %s %s id="%s" value="%s" class="class-single-term">%s',
          $args['selected'],
          $args['disabled'],
          $args['id'],
          $args['value'],
          $pad . $args['label']
        );
    }

    /**
     * Ends the element output, if needed.
     *
     * @param string $output Passed by reference. Used to append additional content.
     * @param object $term The current term object.
     * @param int $depth Depth of the term in reference to parents. Default 0.
     * @param array $args An array of arguments. @see wp_terms_checklist()
     * @see Walker::end_el()
     *
     */
    public function end_el(&$output, $term, $depth = 0, $args = []) {
      if ('radio' == $this->input_element) {
        $output .= "</li>\n";
      } else {
        $output .= "</option>\n";
      }
    }

  }

endif; // class_exists check
