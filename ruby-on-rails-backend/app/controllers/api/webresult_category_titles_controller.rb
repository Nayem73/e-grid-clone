module Api
  class WebresultCategoryTitlesController < ApplicationController
    # GET /api/webresult_category_titles
    def index
      @categories = WebresultCategoryTitle.all
      render json: @categories
    end

    # GET /api/webresult_category_titles/:id
    def show
      @category = WebresultCategoryTitle.find(params[:id])
      render json: @category
    end

    # POST /api/webresult_category_titles
    def create
      @category = WebresultCategoryTitle.new(category_params)

      if @category.save
        render json: @category, status: :created
      else
        render json: @category.errors, status: :unprocessable_entity
      end
    end

    # PUT /api/webresult_category_titles/:id
    def update
      @category = WebresultCategoryTitle.find(params[:id])

      if @category.update(category_params)
        render json: @category
      else
        render json: @category.errors, status: :unprocessable_entity
      end
    end

    # DELETE /api/webresult_category_titles/:id
    def destroy
      @category = WebresultCategoryTitle.find(params[:id])
      @category.destroy
    end

    private

    def category_params
      params.require(:webresult_category_title).permit(:title_en, :title_jp)
    end
  end
end
