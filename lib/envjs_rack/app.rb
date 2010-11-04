require 'sinatra/base'

class EnvjsRack
  class App < Sinatra::Base
    
    set :public, File.expand_path('../../../public', __FILE__)
    
    get '/' do
      redirect '/index.html'
    end
    
  end
end