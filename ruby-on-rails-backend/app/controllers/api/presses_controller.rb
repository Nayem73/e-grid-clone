module Api
  class PressesController < ApplicationController
    before_action :set_press, only: [:show, :update, :destroy]

    # GET /api/presses
    def index
      @presses = Press.includes(:press_translations).all
      render json: @presses, include: :press_translations
    end

    # GET /api/presses/:id
    def show
      render json: @press, include: :press_translations
    end

    # POST /api/presses
    def create
      @press = Press.new(press_params)

      if @press.save
        render json: @press.as_json(include: :press_translations), status: :created, location: api_press_url(@press)
      else
        render json: @press.errors, status: :unprocessable_entity
      end
    end

    # PUT /api/presses/:id
    def update
      if @press.update(press_params)
        render json: @press, include: :press_translations
      else
        render json: @press.errors, status: :unprocessable_entity
      end
    end

    # DELETE /api/presses/:id
    def destroy
      @press.destroy
    end

    private

    def set_press
      @press = Press.find(params[:id])
    end

    def press_params
      params.require(:press).permit(
        :slug,
        press_translations_attributes: [:id, :locale, :title, :description, :image_url]
      )
    end
  end
end
