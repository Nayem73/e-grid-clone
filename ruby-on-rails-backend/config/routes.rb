Rails.application.routes.draw do
  namespace :api do
    resources :services
  end
end