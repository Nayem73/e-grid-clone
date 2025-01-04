module Api
  class UsersController < ApplicationController
    before_action :authorized, only: [:auto_login]

    # REGISTER
    def create
      @user = User.create(user_params)
      if @user.valid?
        token = encode_token({ user_id: @user.id })
        set_token_cookie(token)
        render json: { user: @user }, status: :created
      else
        render json: { error: "Invalid username or password" }, status: :unprocessable_entity
      end
    end

    # LOGIN
    def login
      @user = User.find_by(username: params[:username])
      if @user&.authenticate(params[:password])
        token = encode_token({ user_id: @user.id })
        set_token_cookie(token)
        render json: { user: @user }, status: :ok
      else
        render json: { error: "Invalid username or password" }, status: :unauthorized
      end
    end

    # AUTO LOGIN
    def auto_login
      if logged_in_user
        render json: { user: @user }, status: :ok
      else
        render json: { message: 'Please log in' }, status: :unauthorized
      end
    end

    # LOGOUT
    def logout
      cookies.delete(:auth_token) # Clear the auth_token cookie
      render json: { message: 'Logged out successfully' }, status: :ok
    end

    private

    def user_params
      params.permit(:username, :password)
    end

    def set_token_cookie(token)
      cookies.signed[:auth_token] = {
        value: token,
        httponly: true,
        secure: Rails.env.production?,
        same_site: :strict,
        expires: 24.hours.from_now
      }
    end
  end
end
