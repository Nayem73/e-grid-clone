module Api
  class CarouselImagesController < ApplicationController
    # GET /api/carousel_images
    def index
      @carousel_images = CarouselImage.all
      render json: @carousel_images
    end

    # GET /api/carousel_images/:id
    def show
      @carousel_image = CarouselImage.find(params[:id])
      render json: @carousel_image
    end

    # POST /api/carousel_images
    def create
      @carousel_image = CarouselImage.new(carousel_image_params)

      if @carousel_image.save
        render json: @carousel_image, status: :created, location: api_carousel_image_url(@carousel_image)
      else
        render json: @carousel_image.errors, status: :unprocessable_entity
      end
    end

    # PUT /api/carousel_images/:id
    def update
      @carousel_image = CarouselImage.find(params[:id])

      if @carousel_image.update(carousel_image_params)
        render json: @carousel_image
      else
        render json: @carousel_image.errors, status: :unprocessable_entity
      end
    end

    # DELETE /api/carousel_images/:id
    def destroy
      @carousel_image = CarouselImage.find(params[:id])
      @carousel_image.destroy
    end

    private

    def carousel_image_params
      params.require(:carousel_image).permit(:image_url)
    end
  end
end
