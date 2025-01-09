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
    resources :webresult_categories do
      collection do
        post :update_positions
        post :update_detail
        post :create_with_translations
      end
    end
    resources :webresult_category_titles  
  end
end