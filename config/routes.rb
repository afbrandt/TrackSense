Rails.application.routes.draw do

  get 'tags/show'

  post 'increment/:id' => 'submissions#increment_play_count'

  get 'tags/create'

  get 'tags_controller/create'

  get 'sessions/new'

  root 'static_pages#home'

  get 'about' => 'static_pages#about'
  get 'digest' => 'static_pages#digest_signup'
  get 'coming_soon' => 'static_pages#coming_soon'

  post   'login'   => 'sessions#create'
  delete 'logout'  => 'sessions#destroy'

  get 'previousDay' => 'static_pages#loadNewDay'

  resources :users, except: [:index, :destroy] do
    member do
      get :memberships
    end
  end
  resources :submissions, only: [:create, :destroy]
  resources :votes, except: [:show, :update]
  resources :tags
  resources :groups, except: [:show, :update] do
    member do
      get :members
    end
  end
  resources :group_relationships, only: [:create, :destroy]

  get 'tags/index' => 'tags#index'
  get 'tag/:name' => 'tags#show'
  get 'groups/:name' => 'groups#show', as: 'group_name'

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
