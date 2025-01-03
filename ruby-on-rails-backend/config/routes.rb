Rails.application.routes.draw do
  namespace :api do
    resources :services
    resources :carousel_images
    resources :carousel_translations
    resources :service_softwaredev
    resources :service_softwaredev_results
  end
end