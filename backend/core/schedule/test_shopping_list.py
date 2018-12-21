import pytest
from typing import Dict, List, Union

from django.urls import reverse
from rest_framework import status
from datetime import date, timedelta

from .utils import combine_ingredients, simplify_units
from core.models import Recipe, Ingredient

pytestmark = pytest.mark.django_db


def omit(d: Union[Dict, List], keys=[]) -> Union[List[Dict], Dict]:
    if isinstance(d, list):
        return [{k: v for k, v in i.items() if k not in keys} for i in d]
    return {k: v for k, v in d.items() if k not in keys}


def test_combining_ingredients(user):
    """
    Caveat: order of ingredients affects ending unit

    x lbs + y kg => z kg
    x kg + y lbs => z lbs
    """

    name = "Recipe name"
    author = "Recipe author"
    source = "www.exmple.com"
    time = "1 hour"

    recipe = Recipe.objects.create(
        name=name, author=author, source=source, time=time, owner=user
    )

    Ingredient.objects.create(
        quantity="1 kg", name="tomato", position=10.0, recipe=recipe
    )

    Ingredient.objects.create(
        quantity="2 tbs", name="soy sauce", position=11.0, recipe=recipe
    )

    Ingredient.objects.create(
        quantity="2 lbs", name="tomato", position=12.0, recipe=recipe
    )

    ingredients = list(Ingredient.objects.all())

    actual = sorted(combine_ingredients(ingredients), key=lambda x: x.get("name"))

    expected = sorted(
        [
            {"name": "tomato", "unit": "4.204622621848776 pound"},
            {"name": "soy sauce", "unit": "2 tablespoon"},
        ],
        key=lambda x: x.get("name"),
    )

    assert omit(actual, "origin") == omit(expected, "origin")


def test_fetching_shoppinglist(client, user, recipe):

    client.force_authenticate(user)
    start = date(1976, 7, 6)
    end = start + timedelta(days=1)
    params = {"start": start, "end": end}

    shoppinglist_url = reverse("shopping-list")
    res = client.get(shoppinglist_url, params)
    assert res.status_code == status.HTTP_200_OK
    assert res.json() == []

    recipe.schedule(user=user, on=start, count=2)

    res = client.get(shoppinglist_url, params)
    assert res.status_code == status.HTTP_200_OK
    assert res.json() != []

    expected = [
        {"unit": "2 pound", "name": "egg"},
        {"unit": "4 tablespoon", "name": "soy sauce"},
    ]

    assert omit(res.json(), "origin") == omit(expected, "origin")


def test_fetching_shoppinglist_with_team_recipe(client, team, user, recipe):

    client.force_authenticate(user)

    assert team.is_member(user)

    recipe = recipe.move_to(team)

    start = date(1976, 7, 6)
    end = start + timedelta(days=1)
    params = {"start": start, "end": end}

    url = reverse("shopping-list")
    res = client.get(url, params)
    assert res.status_code == status.HTTP_200_OK
    assert res.json() == []

    recipe.schedule(user=user, on=start, count=2)

    res = client.get(url, params)
    assert res.status_code == status.HTTP_200_OK
    assert res.json() != []

    expected = [
        {"unit": "2 pound", "name": "egg"},
        {"unit": "4 tablespoon", "name": "soy sauce"},
    ]

    assert omit(res.json(), "origin") == omit(expected, "origin")


def test_combining_ingredients_with_out_units(user):
    """
    ensure that we can combine things like 1 garlic clove
    """

    name = "Recipe name"
    author = "Recipe author"

    recipe = Recipe.objects.create(name=name, author=author, owner=user)

    recipe2 = Recipe.objects.create(name="Another recipe", author=author, owner=user)

    Ingredient.objects.create(
        quantity="8", name="garlic cloves", position=10.0, recipe=recipe2
    )

    Ingredient.objects.create(
        quantity="1", name="garlic clove", position=11.0, recipe=recipe
    )

    ingredients = list(Ingredient.objects.all())

    actual = sorted(combine_ingredients(ingredients), key=lambda x: x.get("name"))

    expected = [
        {
            "name": "garlic cloves",
            "unit": "9",
            "origin": [
                {"quantity": "1", "recipe": recipe.id},
                {"quantity": "8", "recipe": recipe2.id},
            ],
        }
    ]

    assert actual == expected


def test_combining_ingredients_with_dashes_in_name(user):
    """
    ensure that we can combine names with dashes
    """

    name = "Recipe name"
    author = "Recipe author"

    recipe = Recipe.objects.create(name=name, author=author, owner=user)

    recipe2 = Recipe.objects.create(name="Another recipe", author=author, owner=user)

    Ingredient.objects.create(
        quantity="1 tablespoon",
        name="extra-virgin olive oil",
        position=10.0,
        recipe=recipe,
    )

    Ingredient.objects.create(
        quantity="8 tablespoons",
        name="extra virgin olive oil",
        position=11.0,
        recipe=recipe2,
    )

    ingredients = list(Ingredient.objects.all())

    actual = combine_ingredients(ingredients)

    expected = [
        {
            "name": "extra virgin olive oil",
            "unit": "9 tablespoon",
            "origin": [
                {"quantity": "8 tablespoon", "recipe": recipe2.id},
                {"quantity": "1 tablespoon", "recipe": recipe.id},
            ],
        }
    ]

    assert actual == expected


def test_combining_recipes_with_improper_quantities(client, user):
    """
    make sure we can combine recipes with units like 'some' and 'sprinkle'
    """

    # 1. create our recipes
    recipe = Recipe.objects.create(
        name="Salmon and Tomatoes in Foil", author="Mark Bittman", owner=user
    )

    name = "basil leaves"
    count = 16
    Ingredient.objects.create(quantity=count, name=name, position=10.0, recipe=recipe)

    recipe2 = Recipe.objects.create(
        name="Pizza With Sweet and Hot Peppers", author="David Tanis", owner=user
    )

    start = date(1976, 7, 6)

    recipe.schedule(user=user, on=start, count=1)

    recipe2.schedule(user=user, on=start, count=1)

    # 2. set ingredients of second recipe to 'basic' quantities and assert
    for i, quantity in enumerate(["some", "sprinkle"]):

        Ingredient.objects.filter(recipe=recipe2).delete()

        Ingredient.objects.create(
            quantity=quantity, name=name, position=(10.0 + i), recipe=recipe2
        )

        client.force_authenticate(user)
        end = start + timedelta(days=1)
        params = {"start": start, "end": end}
        url = reverse("shopping-list")
        res = client.get(url, params)
        assert res.status_code == status.HTTP_200_OK
        assert res.json() != []

        assert res.json()[0].get("unit") == str(count) + " + some"
        assert res.json()[0].get("name") == name


def test_combining_ingredients_with_approximations(user):
    """
    ensure that we can combine 'some pepper', '2 teaspoons pepper', 'sprinkle pepper'
    """

    name = "Recipe name"
    author = "Recipe author"

    recipe = Recipe.objects.create(name=name, author=author, owner=user)

    recipe2 = Recipe.objects.create(name="Another recipe", author=author, owner=user)

    Ingredient.objects.create(
        quantity="1 tablespoon", name="black pepper", position=10.0, recipe=recipe
    )
    Ingredient.objects.create(
        quantity="2 tablespoon", name="black pepper", position=11.0, recipe=recipe
    )
    Ingredient.objects.create(
        quantity="sprinkle", name="black pepper", position=12.0, recipe=recipe
    )

    Ingredient.objects.create(
        quantity="some", name="black pepper", position=13.0, recipe=recipe2
    )

    ingredients = list(Ingredient.objects.all())

    actual = combine_ingredients(ingredients)

    expected = [
        {
            "name": "black pepper",
            "unit": "3 tablespoon + some",
            "origin": [
                {"quantity": "some", "recipe": recipe2.id},
                {"quantity": "sprinkle", "recipe": recipe.id},
                {"quantity": "2 tablespoon", "recipe": recipe.id},
                {"quantity": "1 tablespoon", "recipe": recipe.id},
            ],
        }
    ]

    assert actual == expected


def test_fetching_shoppinglist_with_invalid_dates(user, client):
    params = {"start": None, "end": "invalid date"}
    url = reverse("shopping-list")
    client.force_authenticate(user)
    res = client.get(url, params)
    assert res.status_code == status.HTTP_400_BAD_REQUEST


def test_scheduling_multiple_times_some_ingredient(user, client):
    """
    with an ingredient of quantity sprinkle that we add to the cart multiple
    times shouldn't become sprinklesprinklesprinkle
    """

    name = "Recipe name"
    author = "Recipe author"
    for quantity in ["sprinkle", "some"]:

        recipe = Recipe.objects.create(name=name, author=author, owner=user)

        Ingredient.objects.create(
            quantity=quantity, name="black pepper", position=10.0, recipe=recipe
        )

        start = date(1976, 7, 6)
        recipe.schedule(user=user, on=start, count=3)

        end = start + timedelta(days=1)
        params = {"start": start, "end": end}
        url = reverse("shopping-list")
        client.force_authenticate(user)
        res = client.get(url, params)
        assert res.status_code == status.HTTP_200_OK
        assert res.json()[0].get("unit") == "some"


def test_combining_ingredient_with_range_quantity(user, client, empty_recipe):
    """
    '4-5 medium button mushrooms' in the cart twice should produce
    '10 medium button mushrooms'
    """
    name = "medium button mushrooms"
    Ingredient.objects.create(
        quantity="4-5", name=name, position=10.0, recipe=empty_recipe
    )

    start = date(1976, 7, 6)
    empty_recipe.schedule(user=user, on=start, count=2)

    end = start + timedelta(days=1)
    params = {"start": start, "end": end}
    url = reverse("shopping-list")
    client.force_authenticate(user)
    res = client.get(url, params)
    assert res.status_code == status.HTTP_200_OK

    combined_ingredient = res.json()[0]
    assert combined_ingredient.get("name") == name
    assert combined_ingredient.get("unit") == "10"


def test_combining_ingredients_plural_and_singular_tomatoes(user, client, empty_recipe):
    """
    1 large tomato + 2 large tomatoes --> 3 large tomatoes or possibly 3 large tomato
    """
    Ingredient.objects.create(
        quantity="1", name="large tomato", position=10.0, recipe=empty_recipe
    )

    Ingredient.objects.create(
        quantity="2", name="large tomatoes", position=11.0, recipe=empty_recipe
    )

    start = date(1976, 7, 6)
    empty_recipe.schedule(user=user, on=start, count=1)

    end = start + timedelta(days=1)
    params = {"start": start, "end": end}
    client.force_authenticate(user)
    url = reverse("shopping-list")
    res = client.get(url, params)
    assert res.status_code == status.HTTP_200_OK

    assert len(res.json()) == 1

    combined_ingredient = res.json()[0]
    assert combined_ingredient.get("unit") == "3"
    assert combined_ingredient.get("name") == "large tomatoes"


def test_combining_ingredients_plural_and_singular_lemon(user, client, empty_recipe):
    """
    1.5 lemon + 2 lemons --> 3.5 lemons
    """
    Ingredient.objects.create(
        quantity="1/2", name="lemon", position=10.0, recipe=empty_recipe
    )

    Ingredient.objects.create(
        quantity="1", name="lemon", position=11.0, recipe=empty_recipe
    )

    Ingredient.objects.create(
        quantity="2", name="lemons", position=12.0, recipe=empty_recipe
    )

    start = date(1976, 7, 6)
    empty_recipe.schedule(user=user, on=start, count=1)

    end = start + timedelta(days=1)
    params = {"start": start, "end": end}
    client.force_authenticate(user)
    url = reverse("shopping-list")
    res = client.get(url, params)
    assert res.status_code == status.HTTP_200_OK

    assert len(res.json()) == 1

    combined_ingredient = res.json()[0]
    assert combined_ingredient.get("unit") == "3.5"
    assert combined_ingredient.get("name") == "lemons"


def test_combining_plural_and_singular_leaves(user, client, empty_recipe):
    """
    1 bay leaf, 4 bay leaves --> 5 bay leaves
    """
    Ingredient.objects.create(
        quantity="1", name="bay leaf", position=10.0, recipe=empty_recipe
    )

    Ingredient.objects.create(
        quantity="4", name="bay leaves", position=11.0, recipe=empty_recipe
    )

    start = date(1976, 7, 6)
    empty_recipe.schedule(user=user, on=start, count=1)

    end = start + timedelta(days=1)
    params = {"start": start, "end": end}
    client.force_authenticate(user)
    url = reverse("shopping-list")
    res = client.get(url, params)
    assert res.status_code == status.HTTP_200_OK

    assert len(res.json()) == 1

    combined_ingredient = res.json()[0]
    assert combined_ingredient.get("unit") == "5"
    assert combined_ingredient.get("name") == "bay leaves"


def test_report_bad_merge(user, client, recipe):
    url = reverse("report-bad-merge")
    assert client.post(url).status_code == status.HTTP_403_FORBIDDEN

    client.force_authenticate(user)
    assert client.post(url).status_code == status.HTTP_201_CREATED


def test_combining_feta(user, client, empty_recipe):
    """
    ensure the singularize function doesn't result in feta becoming fetum along
    with some other troublesome examples
    """

    position = 11.0

    ingredients = [
        ("some", "feta"),
        ("1.25 cups", "all-purpose flour"),
        ("some", "katamata olives"),
        ("some", "red pepper flakes"),
        ("2 tablespoon", "molasses"),
    ]

    for quantity, name in ingredients:
        Ingredient.objects.create(
            quantity=quantity, name=name, position=position, recipe=empty_recipe
        )
        position += 10

    start = date(1976, 7, 6)
    empty_recipe.schedule(user=user, on=start, count=1)

    end = start + timedelta(days=1)
    params = {"start": start, "end": end}
    client.force_authenticate(user)
    url = reverse("shopping-list")
    res = client.get(url, params)
    assert res.status_code == status.HTTP_200_OK

    for processed, (_, name) in zip(res.json(), ingredients):
        assert processed.get("name") == name


def test_simplify_units():
    values = ["tablespoon", "some", "sprinkle", "pinch"]
    expected = ["tablespoon", "some"]
    actual = simplify_units(values)
    assert expected == actual


def test_combining_varied_case(user):
    """
    ensure ingredients get their case normalized
    """

    name = "Recipe name"
    author = "Recipe author"

    recipe = Recipe.objects.create(name=name, author=author, owner=user)

    recipe2 = Recipe.objects.create(name="Another recipe", author=author, owner=user)

    Ingredient.objects.create(
        quantity="8", name="Garlic Cloves", position=10.0, recipe=recipe2
    )

    Ingredient.objects.create(
        quantity="1", name="garlic clove", position=11.0, recipe=recipe
    )

    ingredients = list(Ingredient.objects.all())

    actual = sorted(combine_ingredients(ingredients), key=lambda x: x.get("name"))

    expected = [
        {
            "name": "garlic cloves",
            "unit": "9",
            "origin": [
                {"quantity": "1", "recipe": recipe.id},
                {"quantity": "8", "recipe": recipe2.id},
            ],
        }
    ]

    assert actual == expected