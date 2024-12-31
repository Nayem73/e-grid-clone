class Api::ServicesController < ApplicationController
  before_action :set_service, only: [:show, :update, :destroy]

  # GET /api/services
  def index
    @services = Service.all
    render json: @services
  end

  # GET /api/services/:id
  def show
    render json: @service
  end

  # POST /api/services
  def create
    @service = Service.new(service_params)
    if @service.save
      render json: @service, status: :created
    else
      render json: @service.errors, status: :unprocessable_entity
    end
  end

  # PUT /api/services/:id
  def update
    if @service.update(service_params)
      render json: @service
    else
      render json: @service.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/services/:id
  def destroy
    @service.destroy
  end

  private

  def set_service
    @service = Service.find(params[:id])
  end

  def service_params
    params.require(:service).permit(:title, :description, :image_url)
  end
end
