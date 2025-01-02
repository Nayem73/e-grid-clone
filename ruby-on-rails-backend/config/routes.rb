Rails.application.routes.draw do
  namespace :api do
    resources :services
    resources :carousel_images
    resources :carousel_translations
  end
end