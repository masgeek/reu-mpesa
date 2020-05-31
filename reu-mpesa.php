<?php

/*
Plugin Name: Reu Mpesa
Plugin URI: https://tsobu.co.ke/mpesa
Description: MPESA Payment plugin for wordpress
Version: 1.0
Author: Sammy Barasa
Author URI: https://tsobu.co.ke
License: GPL2
*/

defined('ABSPATH') or die('No script kiddies please!');

require_once 'vendor/autoload.php';

class MyGithub extends \Github\Client
{
}

;

//create shortcodes
function github_issues_func($atts, $gh = null)
{
    $gh = ($gh) ? $gh : new MyGithub();

    // Make the API call to get issues, passing in the GitHub owner and repository
    $issues = $gh->api('issue')->all('TransitScreen', 'wp-github-pipeline');

    // Handle the case when there are no issues
    if (empty($issues)) {
        return "<strong>" . __("No issues to show", 'reu-mpesa') . "</strong>";
    }

    // We're going to return a string. First, we open a list.
    $return = "<ul>";
    // Loop over the returned issues
    foreach ($issues as $issue) {

        // Add a list item for each issue to the string
        // (Feel free to get fancier here)
        // Maybe make each one a link to the issue issuing $issue['url] )
        $return .= "<li>{$issue['title']}</li>";

    }
    // Don't forget to close the list
    $return .= "</ul>";

    return $return;
}

add_shortcode("github_issues", "github_issues_func");

//Register settings menu
add_action("admin_menu", "gh_plugin_menu_func");
function gh_plugin_menu_func()
{
    add_submenu_page("options-general.php",
        "GitHub",
        "GitHub",
        "manage_options",
        "github",
        "gh_plugin_options"
    );
}

//print markup for the page
function gh_plugin_options()
{
    if (!current_user_can("manage_options")) {
        wp_die(__("You do not have sufficient permissions to access this page."));
    }
    ?>
    <form method="post" action="<?php echo admin_url('admin-post.php'); ?>">

        <input type="hidden" name="action" value="update_github_settings"/>

        <h3><?php _e("GitHub Repository Info", "reu-mpesa"); ?></h3>
        <p>
            <label><?php _e("GitHub Organization:", "reu-mpesa"); ?></label>
            <input class="" type="text" name="gh_org" value="<?php echo get_option('gh_org'); ?>"/>
        </p>

        <p>
            <label><?php _e("GitHub repository (slug):", "reu-mpesa"); ?></label>
            <input class="" type="text" name="gh_repo" value="<?php echo get_option('gh_repo'); ?>"/>
        </p>

        <input class="button button-primary" type="submit" value="<?php _e("Save", "reu-mpesa"); ?>"/>

    </form>
    <?php
}

add_action('admin_post_update_github_settings', 'github_handle_save');

function github_handle_save()
{

}