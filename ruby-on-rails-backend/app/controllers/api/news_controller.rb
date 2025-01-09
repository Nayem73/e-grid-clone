module Api
  class NewsController < ApplicationController
    before_action :set_news, only: [:show, :update, :destroy]

    # GET /api/news
    def index
      @news_items = News.includes(:news_translations).all
      render json: @news_items, include: :news_translations
    end

    # GET /api/news/:id
    def show
      render json: @news, include: :news_translations
    end

    # POST /api/news
    def create
      @news = News.new(news_params)

      if @news.save
        render json: @news.as_json(include: :news_translations), status: :created, location: api_news_url(@news)
      else
        render json: @news.errors, status: :unprocessable_entity
      end
    end

    # PUT /api/news/:id
    def update
      if @news.update(news_params)
        render json: @news, include: :news_translations
      else
        render json: @news.errors, status: :unprocessable_entity
      end
    end

    # DELETE /api/news/:id
    def destroy
      @news.destroy
    end

    private

    def set_news
      @news = News.find(params[:id])
    end

    def news_params
      params.require(:news).permit(
        :slug,
        news_translations_attributes: [:id, :locale, :title, :description, :image_url]
      )
    end
  end
end
