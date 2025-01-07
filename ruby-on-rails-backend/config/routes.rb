Rails.application.routes.draw do
  namespace :api do
    resources :services
    resources :carousel_images
    resources :carousel_translations
    resources :service_softwaredev
    resources :service_softwaredev_results
    resource :users, only: [:create]
    post "/login", to: "users#login"
    get "/auto_login", to: "users#auto_login"
    delete "/logout", to: "users#logout"
    resources :webresult_experiences
    resources :webresult_categories
  end
end