require 'test_helper'

class EnvjsRackAppTest < Test::Unit::TestCase
  
  include Capybara
  
  def test_should_render_ajax_response_in_the_current_page
    root_path = '/index.html'
    
    visit      root_path
    click_link 'anchor-1'
    
    within '#testResponseContainer' do
      assert page.has_content?('Hello World')
    end

    expected_window_location = 'http://www.example.com' + root_path + '#' + '/javascripts/test-response.js'
    assert_equal expected_window_location, current_url
  end
  
end