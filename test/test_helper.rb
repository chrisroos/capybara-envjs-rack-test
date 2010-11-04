require "rubygems"
require "bundler/setup"

require 'capybara'
require 'capybara/dsl'
require 'capybara/envjs'

require 'envjs_rack'

Capybara.default_driver          = :envjs
Capybara.app                     = EnvjsRack::App
Capybara.save_and_open_page_path = File.expand_path('../../tmp', __FILE__)

require 'test/unit'