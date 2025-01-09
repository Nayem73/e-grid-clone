module Api
  class ProductsController < ApplicationController
    before_action :set_product, only: [:show, :update, :destroy]

    # GET /api/products
    def index
      @products = Product.includes(:product_translations).all
      render json: @products, include: :product_translations
    end

    # GET /api/products/:id
    def show
      render json: @product, include: :product_translations
    end

    # POST /api/products
    def create
      @product = Product.new(product_params)

      if @product.save
        render json: @product.as_json(include: :product_translations), status: :created, location: api_product_url(@product)
      else
        render json: @product.errors, status: :unprocessable_entity
      end
    end

    # PUT /api/products/:id
    def update
      if @product.update(product_params)
        render json: @product, include: :product_translations
      else
        render json: @product.errors, status: :unprocessable_entity
      end
    end

    # DELETE /api/products/:id
    def destroy
      @product.destroy
    end

    private

    def set_product
      @product = Product.find(params[:id])
    end

    def product_params
      params.require(:product).permit(
        :slug,
        product_translations_attributes: [:id, :locale, :title, :description, :image_url]
      )
    end
  end
end
