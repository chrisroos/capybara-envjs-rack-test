require 'test_helper'

class EnvjsRackAppTest < Test::Unit::TestCase
  
  include Capybara
  
  def test_should_render_ajax_response_in_the_current_page
    visit '/'
    click_link 'anchor-1'
    
    within '#testResponseContainer' do
      assert page.has_content?('Hello World')
    end
    
    # save_and_open_page
  end
  
end