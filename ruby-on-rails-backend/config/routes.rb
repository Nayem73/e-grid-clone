Rails.application.routes.draw do
  resources :pages do
    resources :page_components
  end
  
  resources :media
  
  resources :page_components do
    resources :component_media, only: [:create, :destroy]
  end
end