<!DOCTYPE html>
<html>
    <head>
        <!-- FIXME: title is incorrect -->
        <title><% if $Title %>{$Title}<% else %>My Webpage<% end_if %></title>
        <%-- TODO: add stylesheets and scripts --%>
        <% include $Meta %>
    </head>
    <body>
    <div>
        <%-- FIXME: $Condition is not defined --%>
        <!-- Start loop -->
        <% loop $Condition %>
        Loop content
        <% end_loop %>
    </div>
    </body>
</html>
