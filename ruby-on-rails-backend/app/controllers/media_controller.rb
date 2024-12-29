class MediaController < ApplicationController
  def create
    @media = Media.new(media_params)
    
    if @media.save
      render json: @media, status: :created
    else
      render json: @media.errors, status: :unprocessable_entity
    end
  end

  private

  def media_params
    params.require(:media).permit(:file, :alt_text)
  end
end