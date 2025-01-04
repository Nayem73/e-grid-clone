class ApplicationController < ActionController::API
  include ActionController::Cookies

  JWT_SECRET = ENV['JWT_SECRET'] || 'fallbackSecret'

  # Encode a JWT token
  def encode_token(payload)
    payload[:exp] = 24.hours.from_now.to_i # Token expires in 24 hours
    JWT.encode(payload, JWT_SECRET)
  end

  # Decode the JWT token
  def decoded_token
    if cookies.signed[:auth_token]
      token = cookies.signed[:auth_token]
      begin
        JWT.decode(token, JWT_SECRET, true, algorithm: 'HS256')
      rescue JWT::ExpiredSignature
        render json: { error: "Token has expired" }, status: :unauthorized
        nil
      rescue JWT::DecodeError
        render json: { error: "Invalid token" }, status: :unauthorized
        nil
      end
    end
  end

  # Get logged-in user from token
  def logged_in_user
    if decoded_token
      user_id = decoded_token[0]['user_id']
      @user = User.find_by(id: user_id)
    end
  end

  # Check if user is logged in
  def logged_in?
    !!logged_in_user
  end

  # Ensure the user is authorized
  def authorized
    render json: { message: 'Please log in' }, status: :unauthorized unless logged_in?
  end
end
