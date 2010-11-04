$LOAD_PATH << File.expand_path('../lib', __FILE__)

require 'envjs_rack'

run EnvjsRack::App